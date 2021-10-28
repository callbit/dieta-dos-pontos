<?php

namespace App\Controller;

use Cake\Controller\Controller;
use CrudView\Menu\MenuDivider;
use CrudView\Menu\MenuItem;

class AppController extends Controller
{
    use \Crud\Controller\ControllerTrait;

    public function initialize()
    {
        parent::initialize();

        $this->loadComponent('RequestHandler', ['enableBeforeRedirect' => false]);
        $this->loadComponent('Flash');

        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'finder' => 'auth',
                    'fields' => [
                        'username' => 'email',
                        'password' => 'password',
                    ],
                ],
            ],
            'loginAction' => [
                'controller' => 'Users',
                'action' => 'login',
            ],
            // If unauthorized, return them to page they were just on
            'unauthorizedRedirect' => $this->referer(),
        ]);

        $this->loadComponent('Crud.Crud', [
            'actions' => [
                'index' => [
                    'className' => 'Crud.Index',
                    'relatedModels' => true,
                ],
                'add' => [
                    'className' => 'Crud.Add',
                    'relatedModels' => true,
                ],
                'edit' => [
                    'className' => 'Crud.Edit',
                    'relatedModels' => true,
                ],
                'view' => [
                    'className' => 'Crud.View',
                    'relatedModels' => true,
                ],
                'delete' => [
                    'className' => 'Crud.Delete',
                    'relatedModels' => true,
                ],

                //'Crud.Delete',
                //'Crud.Lookup',
            ],
            'listeners' => [
                'CrudView.View',
                'Crud.Redirect',
                'Crud.RelatedModels',
                //'Crud.Search',
                //'CrudView.ViewSearch',
            ],
        ]);

    }

    public function beforeFilter(\Cake\Event\Event $event)
    {
        $this->Crud->action()->setConfig('scaffold.sidebar_navigation', [
            new MenuItem('Usuários', ['controller' => 'Users', 'action' => 'index']),
            new MenuItem('Refeições', ['controller' => 'Meals', 'action' => 'index']),
            new MenuItem('Comidas', ['controller' => 'Foods', 'action' => 'index']),
            new MenuItem('Consumos', ['controller' => 'Consumes', 'action' => 'index']),
            new MenuDivider(),
            new MenuItem('Sair', ['controller' => 'Users', 'action' => 'logout']),
        ]);
        $this->Crud->action()->setConfig('scaffold.utility_navigation', false);
    }

    public function beforeRender(\Cake\Event\Event $event)
    {
        if ($this->viewBuilder()->getClassName() === null) {
            $this->viewBuilder()->setClassName('CrudView\View\CrudView');
            //$this->viewBuilder()->setLayout('default');

        }
    }

}
