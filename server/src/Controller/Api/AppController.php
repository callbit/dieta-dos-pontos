<?php

namespace App\Controller\Api;

use Cake\Controller\Controller;
use Cake\Event\Event;

class AppController extends Controller
{
    use \Crud\Controller\ControllerTrait;
    public function initialize()
    {

        parent::initialize();
        $this->loadComponent('RequestHandler', ['enableBeforeRedirect' => false]);
        $this->loadComponent('Crud.Crud', [
            'actions' => [
                'Crud.Index',
                'Crud.View',
                'Crud.Add',
                'Crud.Edit',
                'Crud.Delete',
            ],
            'listeners' => [
                'Crud.Api',
                'Crud.ApiPagination',
                //'Crud.ApiQueryLog'
            ],
        ]);
        //$this->Crud->config(['listeners.api.exceptionRenderer' => 'Crud\Error\ExceptionRenderer']);
        $this->loadComponent('Auth', [
            'storage' => 'Memory',
            'authenticate' => [
                'Form' => [
                    //'scope' => ['Users.active' => 1]
                    'fields' => [
                        'username' => 'email',
                    ],
                ],
                'ADmad/JwtAuth.Jwt' => [
                    'parameter' => 'token',
                    'userModel' => 'Users',
                    //'scope' => ['Users.active' => 1],
                    'fields' => [
                        'username' => 'id',
                    ],
                    'queryDatasource' => true,
                ],
            ],
            'unauthorizedRedirect' => false,
            'checkAuthIn' => 'Controller.initialize',
        ]);

    }

    /*public function beforeRender(Event $event)
    {
        parent::beforeRender($event);
        
        $this->response->withAddedHeader('Access-Control-Allow-Origin', '*');
    }*/

    private function _setOwner()
    {
        $user = $this->Auth->identify();
        return (!$user) ? null : '';
    }

}
