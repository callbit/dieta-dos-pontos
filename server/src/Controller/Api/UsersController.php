<?php
namespace App\Controller\Api;

use Cake\Event\Event;
use Cake\Http\Exception\UnauthorizedException;
use Cake\ORM\TableRegistry;
use Cake\Utility\Security;
use Firebase\JWT\JWT;
use Cake\Routing\Router;
use Cake\Mailer\Email;
use Cake\Auth\DefaultPasswordHasher;

class UsersController extends AppController
{
    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['token','add','resetPassword','recoverPassword','changeNewPassword']);
    }
    private function _generateToken($data)
    {
        return JWT::encode([
            'sub' => $data['sub'],
            'email' => $data['email'],
            'exp' => time() + 604800,
        ], Security::getSalt());
    }

    public function add()
    {
        $this->Crud->on('afterSave', function (Event $event) {
            if ($event->getSubject()->created) {
                $this->set('data', [
                    'id' => $event->getSubject()->entity->id,
                    'token' => $this->_generateToken([
                        'sub' => $event->getSubject()->entity->id,
                        'email' => $event->getSubject()->entity->email,
                    ]),
                ]);
                $this->Crud->action()->setConfig('serialize.data', 'data');
            }
        });
        return $this->Crud->execute();
    }

    public function token()
    {
        $user = $this->Auth->identify();
        if (!$user) {

            throw new UnauthorizedException('Usuário e/ou senha inválidos! Tente novamente.');
        }
        $this->set([
            'success' => true,
            'data' => [
                'token' => $this->_generateToken([
                    'sub' => $user['id'],
                    'email' => $user['email'],
                ]),
            ],
            '_serialize' => ['success', 'data'],
        ]);
    }

    public function changePassword()
    {
        $user = $this->Auth->identify();
        if (!$user) {
            throw new UnauthorizedException(__('Usuário e/ou senha inválidos'));
        }
        $this->Users = TableRegistry::get('Users');
        $user = $this->Users->get($user['id']);
        $checkedPass = (new DefaultPasswordHasher)->check($this->request->getData('oldPass'), $user['password']);
        if ($checkedPass) {
            $user = $this->Users->patchEntity($user, ['password' => $this->request->getData('newPass')]);
            if ($this->Users->save($user)) {
                $this->set([
                    'success' => true,
                    'data' => [
                        'message' => __('Senha alterada com sucesso!'),
                    ],
                    '_serialize' => ['success', 'data'],
                ]);
            } else {
                $this->set([
                    'success' => false,
                    'data' => [
                        'message' => __('Foi identificado um problema ao alterar sua senha. Tente novamente!'),
                    ],
                    '_serialize' => ['success', 'data'],
                ]);
            }
        } else {
            $this->set([
                'success' => false,
                'data' => [
                    'message' => __('A senha informada não confere. Tente novamente'),
                ],
                '_serialize' => ['success', 'data'],
            ]);
        }
    }

    public function profile()
    {
        $user = $this->Auth->identify();
        if (!$user) {
            throw new UnauthorizedException('Usuário e/ou senha inválidos! Tente novamente.');
        }

        if (!$this->request->is('post')) {
            $this->set([
                'success' => true,
                'data' => [
                    'user' => $user,
                ],
                '_serialize' => ['success', 'data'],
            ]);
        } else {
            $data = $this->request->getData();

            $this->Users = TableRegistry::get('Users');

            $user = $this->Users->get($user['id']);
            $user = $this->Users->patchEntity($user, [
                'name' => $data['name'],
                'dob' => $data['dob'],
                'gender' => $data['gender'],
                'weight' => (int) $data['weight'],
                'height' => (int) $data['height'],
                'activity_level' => (int) $data['activity_level'],
            ]);
            if ($this->Users->save($user)) {
                $this->set([
                    'success' => true,
                    'data' => [
                        'message' => __('Salvo com sucesso!'),
                    ],
                    '_serialize' => ['success', 'data'],
                ]);
            } else {
                $this->set([
                    'success' => false,
                    'data' => [
                        'message' => __('Erro salvando seus dados, tente novamete.'),
                    ],
                    '_serialize' => ['success', 'data'],
                ]);
            }

        }
    }

    public function recoverPassword()
    {
        ///if ($this->request->is(['get'])) {
        if ($this->request->is(['post'])) {
            ini_set ('always_populate_raw_post_data', -1 );
            $emailData = $this->request->getData('email');
            //$data = $this->request->query;
            $userEntity = $this->Users->find('all')
                ->where(['email' => $emailData/*'verified' => true*/])
                ->first();
            if (!empty($userEntity)) {
                $user = $userEntity->toArray();
                $code = sha1($user['email'] . rand(0, 100));
                $link = Router::url(['controller' => 'Users', 'action' => 'resetPassword', $code], true);
                $userEntity->token = $code;
                $userEntity->token_exp = date('Y-m-d H:i:s');
                $this->Users->save($userEntity);
                $email = new Email('default');
                try {
                    $result = $email->setFrom([EMAIL_RESPONSE => APP_NAME])
                        ->setTo([$user['email'] => $user['name']])
                        ->setSubject(__("Recuperar sua senha do Dieta dos Pontos"))
                        ->setEmailFormat("html")
                        ->setTemplate('recover_password', 'default')
                        ->setViewVars(['link' => $link])
                        ->send();
                    $this->set([
                        'success' => true,
                        'data' => ['message' => __('E-mail enviado com sucesso!')],
                        'debug' => compact(['result', 'email']),
                        '_serialize' => ['success', 'data', 'debug'],
                    ]);
                } catch (Exception $ex) {
                    $this->set([
                        'success' => false,
                        'data' => ['erro' => $ex->getMessage()],
                        '_serialize' => ['success', 'data'],
                    ]);
                }
            } else {
                $this->set([
                    'success' => false,
                    'data' => ['erro' => __('E-mail inválido')],
                    '_serialize' => ['success', 'data'],
                ]);
            }
        } else {
            $this->set([
                'success' => false,
                '_serialize' => ['success'],
            ]);
        }
    }
    public function resetPassword()
    {
        $user = array();
        $erro = false;
        if (!empty($this->request->getParam('pass')[0])) {
            $code = $this->request->getParam('pass')[0];
            $userEntity = $this->Users->find('all', [
                'fields' => ['token_exp', 'id'],
            ])->where(['token' => $code])->first();
            $user = ($userEntity) ? $userEntity->toArray() : false;
        }
        if (empty($user) || !$user) {
            $erro = __("Token inválido, tente novamente.");
        } else {
            if (!$user['token_exp']->wasWithinLast(HOURS_TO_EXPIRE_TOKEN_NEW_PASS . ' hours')) {
                $erro = __("Acesso expirado, tente recuperar sua senha novamente");
            }
        }
        $this->set(['erro' => $erro]);
        if (!$erro) {
            return $this->redirect(['action' => 'changeNewPassword', $this->request->getParam('pass')[0]]);
        }
    }

    public function changeNewPassword($token = null)
    {
        $msg = '';
        $erro = false;
        $this->set('title', 'Recuperar senha - Dieta dos Pontos');
        if ($this->request->is('post')) {
            $data = $this->request->getData();
            $data['old_pass'] = (is_null($token)) ? $this->request->data['password'] : false;
            if ($this->validateNewPass($data)) {
                $user = ($this->Auth->user('id'))
                ? $this->Auth->user()
                : $this->Users->find('all')->select(['id', 'email'])->where(['token' => $token])->firstOrFail();
                $user->password = $data['new_pass'];
                $user->token = null;
                $user->token_exp = null;
                $result = $this->Users->save($user);
                if ($result) {
                    $msg = __('Sua senha foi alterada com sucesso, faça o login novamente.');
                } else {
                    $erro = __('Erro ao tentar alterar sua senha. Por favor, tente novamente');
                }
            } else {
                $erro = __('Senha e confirmação não conferem. Por favor, digite novamente');
            }
        }
        $this->set(compact('token', 'erro', 'msg'));
    }

    private function validateNewPass($data)
    {
        // Check that pass and confirm pass are equals
        if ($data['new_pass'] !== $data['new_pass_confirm']) {
            //$this->Flash->error("Les deux nouveaux mots de passe ne correspondent pas.");
            return false;
        }
        // Check la complexité du nouveau pass
        //if (!$this->Users->passwordComplexe($data['new_pass'])) {
        // $this->Flash->error("Le nouveau mot de passe ne respecte pas les règles de complexité. (une majuscule minimum, un chiffre minimum, 8 caractères minimum)");
        //return false;
        //}
        // If it doesn't come from a forget pass, check that old pass is correct
        /*if ($data['old_pass']) {
        $userEntity = $this->Users->find('all')
        ->where(['id' => $this->Auth->user('id')])
        ->select(['password'])
        ->first();
        $hasher = new DefaultPasswordHasher();
        $bcrypt_pass_check = $hasher->check($data['old_pass'], $userEntity["password"]);
        if (empty($userEntity) || !$bcrypt_pass_check) {
        //$this->Flash->error("Le mot de passe actuel n'est pas le bon.");
        return false;
        }
        }*/
        return true;
    }
}
