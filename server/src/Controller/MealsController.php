<?php
namespace App\Controller;

use App\Controller\AppController;

class MealsController extends AppController
{

    public function index()
    {
        $action = $this->Crud->action();
        $action->setConfig('scaffold.fields', [
            'id' => ['title' => '#'],
            'name' => ['title' => 'Nome'],
            'balance' => ['title' => 'Peso'],
        ]);
        $action->setConfig('scaffold.page_title', 'Refeições');
        return $this->Crud->execute();
    }

    public function add()
    {
        $this->setForm();
    }

    public function edit()
    {
        $this->setForm();
    }

    private function setForm(){
        $action = $this->Crud->action();
        $action->setConfig('scaffold.fields', [
            'name' => ['label' => 'Nome'],
            'balance' => ['label' => 'Peso'],
        ]);
        $action->setConfig('scaffold.page_title', 'Refeição');
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
        $action->setConfig('scaffold.page_title', 'Refeição');
        return $this->Crud->execute();
    }
}
