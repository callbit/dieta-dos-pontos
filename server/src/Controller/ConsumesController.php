<?php
namespace App\Controller;

use App\Controller\AppController;

/**
 * Consumes Controller
 *
 * @property \App\Model\Table\ConsumesTable $Consumes
 *
 * @method \App\Model\Entity\Consume[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class ConsumesController extends AppController
{

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Search.Prg', ['actions' => ['index']]);

    }

    public function index()
    {
        $action = $this->Crud->action();
        $action->setConfig('scaffold.fields', [
            'id' => ['title' => '#'],
            'user_id' => ['title' => 'Usuário'],
            'meal_id' => ['title' => 'Refeição'],
            'food_id' => ['title' => 'Comida'],
            'quantity' => ['title' => 'Quantidade'],
            //'unit' => ['title' => 'Unidade'],
        ]);
        $action->setConfig('scaffold.page_title', 'Consumos');

        $this->Crud->on('beforePaginate', function (\Cake\Event\Event $event) {
            $this->paginate['order'] = ['Foods.lft ASC'];
        });

        $this->Crud->addListener('search', 'Crud.Search', ['collection' => 'default']);
        $this->Crud->addListener('viewSearch', 'CrudView.ViewSearch', [
            'enabled' => true,
            'autocomplete' => false,
            'selectize' => false,
            'collection' => 'default',
            'fields' => [
                'user_id' => [
                    'label' => 'Usuário',
                    'empty' => 'Todos',
                ],
            ],
        ]);

        return $this->Crud->execute();
    }

    public function add()
    {
        $action = $this->Crud->action();
        $action->setConfig('scaffold.fields', [
            'user_id' => ['label' => 'Usuário', 'class' => 'no-selectize'],
            'meal_id' => ['label' => 'Refeição', 'class' => 'no-selectize'],
            'food_id' => ['label' => 'Comida', 'class' => 'no-selectize'],
            'quantity' => ['label' => 'Quantidade'],
            //'unit' => ['label' => 'Unidade'],
        ]);
        $action->setConfig('scaffold.page_title', 'Comida');
        return $this->Crud->execute();
    }

    public function edit()
    {
        $action = $this->Crud->action();
        $action->setConfig('scaffold.fields', [
            'user_id' => ['label' => 'Usuário', 'class' => 'no-selectize'],
            'meal_id' => ['label' => 'Refeição', 'class' => 'no-selectize'],
            'food_id' => ['label' => 'Comida', 'class' => 'no-selectize'],
            'quantity' => ['label' => 'Quantidade'],
            //'unit' => ['label' => 'Unidade'],
        ]);
        $action->setConfig('scaffold.page_title', 'Comida');
        return $this->Crud->execute();
    }

    public function view()
    {
        $action = $this->Crud->action();
        // debug($action->getConfig());
        $action->setConfig('scaffold.fields', [
            'id' => ['title' => '#'],
            'name' => ['title' => 'Nome'],
            'cnpj' => ['title' => 'CNPJ'],
            'user_id' => ['title' => 'Usuário'],
        ]);
        $action->setConfig('scaffold.page_title', 'Comida');
        return $this->Crud->execute();
    }
}
