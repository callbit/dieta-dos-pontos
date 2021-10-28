<?php
namespace App\Controller;

use App\Controller\AppController;

class FoodsController extends AppController
{

    public function index()
    {
        $action = $this->Crud->action();
        $action->setConfig('scaffold.fields', [
            'id' => ['title' => '#'],
            'name' => ['title' => 'Nome'],
            'unit' => ['title' => 'Unidade'],
            'points' => ['title' => 'Pontos'],
            'parent_id' => ['title' => 'Categoria'],
        ]);
        $action->setConfig('scaffold.page_title', 'Comidas');

        $this->Crud->on('beforePaginate', function(\Cake\Event\Event $event) {
            $this->paginate['order'] = ['Foods.lft ASC'];
        });

        return $this->Crud->execute();
    }

    public function add()
    {
        $action = $this->Crud->action();
        $action->setConfig('scaffold.fields', [
            'name' => ['label' => 'Nome'],
            'parent_id' => ['label' => 'Categoria', 'class' => 'no-selectize', 'empty'=>'Sem categoria'],
            'unit' => ['label' => 'Unidade'],
            'points' => ['label' => 'Pontos'],
        ]);
        $action->setConfig('scaffold.page_title', 'Comida');
        return $this->Crud->execute();
    }

    public function edit()
    {
        $action = $this->Crud->action();
        $action->setConfig('scaffold.fields', [
            'name' => ['label' => 'Nome'],
            'parent_id' => ['label' => 'Categoria', 'class' => 'no-selectize', 'empty'=>'Sem categoria'],
            'unit' => ['label' => 'Unidade'],
            'points' => ['label' => 'Pontos'],
        ]);
        $action->setConfig('scaffold.page_title', 'Comida');
        return $this->Crud->execute();
    }

    public function view()
    {
        $action = $this->Crud->action();
        // debug($action->getConfig());
        /*$action->setConfig('scaffold.fields', [
        'id' => ['title' => '#'],
        'name' => ['title' => 'Nome'],
        'cnpj' => ['title' => 'CNPJ'],
        'user_id' => ['title' => 'Usuário'],
        ]);*/
        $action->setConfig('scaffold.page_title', 'Comida');
        return $this->Crud->execute();
    }
}
