<?php
namespace App\Controller;

use App\Controller\AppController;

class UsersController extends AppController
{

    public function initialize()
    {
        parent::initialize();
        $this->Crud->mapAction('add', 'Crud.Add');
        $this->Crud->mapAction('login', 'CrudUsers.Login');
        $this->Crud->mapAction('logout', 'CrudUsers.Logout');
        $this->loadComponent('Search.Prg', ['actions' => ['index']]);

    }

    public function login()
    {
        $this->viewBuilder()->setLayout('default');
        return $this->Crud->execute();
    }

    public function index()
    {

        $action = $this->Crud->action();
        $action->setConfig('scaffold.fields', [
            'id' => ['title' => '#'],
            'name' => ['title' => 'Nome'],
            'email' => ['title' => 'E-mail'],
            'verified' => ['title' => 'Verificado'],
            'admin' => ['title' => 'Admin'],
        ]);
        $action->setConfig('scaffold.actions_blacklist', ['login', 'logout']);
        $action->setConfig('scaffold.page_title', 'Usuários');
        $this->Crud->addListener('search', 'Crud.Search', ['collection' => 'default']);
        $this->Crud->addListener('viewSearch', 'CrudView.ViewSearch', [
            'enabled' => true,
            'autocomplete' => false,
            'selectize' => false,
            'collection' => 'default',
            'fields' => [
                'name' => ['label' => 'Nome', 'type' => 'text'],
                'email' => ['label' => 'E-mail', 'type' => 'text'],
            ],
        ]);
        return $this->Crud->execute();
    }

    public function view()
    {

        $action = $this->Crud->action();
        $action->setConfig('scaffold.page_title', 'Detalhes do Usuário');

        $action->setConfig('scaffold.fields', [
            'id' => ['title' => '#'],
            'name' => ['title' => 'Nome'],
            'email' => ['title' => 'E-mail'],
            'verified' => ['title' => 'Verificado'],
            'admin' => ['title' => 'Admin'],

            'dob' => ['title' => 'Data de nascimento'],
            'weight' => ['title' => 'Peso'],
            'height' => ['title' => 'Altura'],
            'imc' => ['title' => 'IMC'],
            'points_per_day' => ['title' => 'Pontos por dia'],
            'gender' => ['title' => 'Gênero'],

            'activity_level' => ['title' => 'Nível de atividade'],
            'created' => ['title' => 'Data de criação'],
            'modified' => ['title' => 'Data de alteração'],

        ]);

        return $this->Crud->execute();
    }

}
