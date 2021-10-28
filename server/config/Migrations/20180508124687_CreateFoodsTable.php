<?php
use Migrations\AbstractMigration;

class CreateFoodsTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('foods');

        $table->addColumn('name', 'string', [
            'default' => null,
            'limit' => 255,
            'null' => false,
        ]);

        $table->addColumn('unit', 'string', [
            'default' => '',
            'limit' => 255,
            'null' => false,
        ]);

        $table->addColumn('points', 'integer', [
            'default' => 0,
            'limit' => 255,
            'null' => false,
        ]);

        $table->addColumn('parent_id', 'integer', [
            'default' => null,
            'limit' => 11,
            'null' => true,
        ]);

        $table->addColumn('lft', 'integer', [
            'default' => null,
            'limit' => 11,
            'null' => false,
        ]);

        $table->addColumn('rght', 'integer', [
            'default' => null,
            'limit' => 11,
            'null' => false,
        ]);

        
        
        $table->addColumn('created', 'datetime', [
            'default' => null,
            'null' => false,
        ]);
        $table->addColumn('modified', 'datetime', [
            'default' => null,
            'null' => false,
        ]);
        $table->addColumn('deleted', 'datetime', [
            'default' => null,
            'null' => true,
        ]);
        
        $table->create();
    }
}
