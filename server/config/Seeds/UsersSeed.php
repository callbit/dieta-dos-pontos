<?php
use Cake\Auth\DefaultPasswordHasher;
use Migrations\AbstractSeed;

// Add this line

/**
 * Users seed.
 */
class UsersSeed extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeds is available here:
     * http://docs.phinx.org/en/latest/seeding.html
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'name' => 'Admin',
                'email' => 'admin@dietasdospontos.com.br',
                'password' => '123123',
                'verified' => 1,
                'admin' => 1,
                'dob' => null,
                'weight' => null,
                'height' => null,
                'activity_level' => null,
                'gender' => null,
            ],
            [
                'name' => 'João da Silva',
                'email' => 'joao@dasilva.com',
                'dob' => '1987-06-14',
                'weight' => 102,
                'height' => 194,
                'activity_level' => 1,
                'gender' => 'male',
                'password' => '123123',
                'verified' => 1,
                'admin' => 0,
            ],
            [
                'name' => 'José da Silva',
                'email' => 'jose@dasilva.com',
                'password' => '123123',
                'verified' => 1,
                'admin' => 0,
                'dob' => null,
                'weight' => null,
                'height' => null,
                'activity_level' => null,
                'gender' => null,
            ],
        ];

        $Table = \Cake\ORM\TableRegistry::get('Users');
        $entities = $Table->newEntities($data);
        foreach ($entities as $entity) {
            $Table->save($entity);
        }

        /*$table = $this->table('users');
    $table->insert($data)->save();*/
    }

    protected function _setPassword($value)
    {
        if (strlen($value)) {
            $hasher = new DefaultPasswordHasher();

            return $hasher->hash($value);
        }
    }
}
