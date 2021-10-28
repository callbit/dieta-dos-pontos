<?php
namespace App\Controller\Api;

use Cake\Collection\Collection;
use Cake\ORM\TableRegistry;

class SyncController extends AppController
{

    public $lastModified;

    public function initialize()
    {
        parent::initialize();
        //$this->Auth->allow(['sync']);
        $this->lastModified = 0;
    }

    public function sync()
    {
        if (!$this->request->is('post')) {
            return;
        }
        $user = $this->Auth->identify();
        if (!$user) {
            throw new UnauthorizedException('Usuário e/ou senha inválidos! Tente novamente.');
        }

        $result = [];

        $result['meals'] = $this->syncModel('Meals', $user, $result);
        $result['foods'] = $this->syncModel('Foods', $user, $result);
        $trash = $this->syncTrash('Consumes', $user, $result);
        $result['consumes'] = $this->syncModel('Consumes', $user, $result);
        $result['lastModified'] = $this->getLastModified($result);
        $result['trash'] = $trash;
        $this->set('result', $result);
        $this->set('_serialize', ['result']);
    }

    private function getLastModified($result)
    {
        $lastModified = 0;
        foreach ($result as $k => $model) {
            foreach ($model as $item) {
                $modified = intval($item->modified->toUnixString());
                if ($modified > $lastModified) {
                    $lastModified = $modified;
                }
            }
        }
        if ($lastModified === 0) {
            $data = $this->request->getData();
            $lastModified = $data['lastModified'];
        }
        return $lastModified;
    }

    private function syncTrash($model, $user, $result)
    {
        $data = $this->request->getData();
        if (empty($data['trash'])) {
            return 0;
        }
        $Model = TableRegistry::get($model);

        $consumes = $Model->find()->where([
            'Consumes.uuid IN' => $data['trash'],
            'Consumes.user_id' => $user['id'],
        ]);

        $res = [];
        foreach ($consumes as $consume) {
            $uuid = $consume->uuid;
            if ($Model->delete($consume)) {
                $res[] = $uuid;
            }
        }
        return $res;

    }

    private function syncModel($model, $user, $result)
    {
        $data = $this->request->getData();
        $Model = TableRegistry::get($model);
        if (isset($data[strtolower($model)])) {
            $modelData = $data[strtolower($model)];
            if (!empty($modelData)) {
                $modelData = (new Collection($modelData))->map(function ($value, $key) use ($user) {
                    $value['user_id'] = $user['id'];
                    return $value;
                })->toArray();
                $entities = $Model->newEntities($modelData, ['accessibleFields' => ['id' => true]]);
                if (!$Model->saveMany($entities)) {
                    return false;
                }
            }
        }
        $lastModified = $data['lastModified'];
        $conditions = [
            ($model . '.modified >') => $lastModified,
        ];
        if ($model === "Consumes") {
            $conditions[($model . '.user_id')] = $user['id'];
        }
        return $Model->find('withTrashed')
            ->where($conditions)
            ->map(function ($value, $key) {
                if (isset($value['date'])) {
                    $value['date'] = $value['date']->format('Y-m-d');
                }
                $value['sync'] = 1;
                return $value;
            })->toArray();
    }

}
