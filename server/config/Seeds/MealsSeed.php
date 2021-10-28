<?php
use Migrations\AbstractSeed;

class MealsSeed extends AbstractSeed
{

    public function run()
    {
        $data = [
            [
                'name' => 'Café da manhã',
                'balance' => 2,
            ],
            [
                'name' => 'Almoço',
                'balance' => 3,
            ],
            [
                'name' => 'Lanche',
                'balance' => 2,
            ],
            [
                'name' => 'Janta',
                'balance' => 2,
            ],
            [
                'name' => 'Outro',
                'balance' => 1,
            ],
        ];

        $Table = \Cake\ORM\TableRegistry::get('Meals');
        $entities = $Table->newEntities($data);
        foreach ($entities as $entity) {
            $Table->save($entity);
        }

        //$table = $this->table('meals');
        //$table->insert($data)->save();
    }
}
