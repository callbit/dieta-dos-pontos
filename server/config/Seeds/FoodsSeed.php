<?php
use Migrations\AbstractSeed;

class FoodsSeed extends AbstractSeed
{

    public function run()
    {
        $data = [
            [
                'name' => 'Banana',
                'parent_id' => null,
            ],
            [
                'name' => 'Banana-da-terra',
                'parent_id' => 1,
                'unit' => 'Unidade',
                'points' => 1,
            ],
            [
                'name' => 'Banana-nanica',
                'parent_id' => 1,
                'unit' => 'Unidade',
                'points' => 1,
            ],
            [
                'name' => 'Banana-ouro',
                'parent_id' => 1,
                'unit' => 'Unidade',
                'points' => 2,
            ],
            [
                'name' => 'Banana-prata',
                'parent_id' => 1,
                'unit' => 'Unidade',
                'points' => 1,
            ],
            [
                'name' => 'Maçã',
                'parent_id' => null,
                'unit' => 'Unidade',
                'points' => 1,
            ],
            [
                'name' => 'Pêra',
                'parent_id' => null,
                'unit' => 'Unidade',
                'points' => 1,
            ],
            [
                'name' => 'Batata',
                'parent_id' => null,
                'unit' => 'Unidade',
                'points' => 1,
            ],
            [
                'name' => 'Feijão',
                'parent_id' => null,
                'unit' => 'Colher de sopa',
                'points' => 1,
            ],
        ];

        $Table = \Cake\ORM\TableRegistry::get('Foods');
        $entities = $Table->newEntities($data);
        foreach ($entities as $entity) {
            $Table->save($entity);
        }

        //$table = $this->table('foods');
        //$table->insert($data)->save();
    }
}
