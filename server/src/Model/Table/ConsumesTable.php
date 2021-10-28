<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Consumes Model
 *
 * @property \App\Model\Table\UsersTable|\Cake\ORM\Association\BelongsTo $Users
 * @property \App\Model\Table\MealsTable|\Cake\ORM\Association\BelongsTo $Meals
 * @property \App\Model\Table\FoodsTable|\Cake\ORM\Association\BelongsTo $Foods
 *
 * @method \App\Model\Entity\Consume get($primaryKey, $options = [])
 * @method \App\Model\Entity\Consume newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Consume[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Consume|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Consume patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Consume[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Consume findOrCreate($search, callable $callback = null, $options = [])
 *
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class ConsumesTable extends Table
{

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->setTable('consumes');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');

        $this->addBehavior('Timestamp');
        $this->addBehavior('Muffin/Trash.Trash');

        $this->belongsTo('Users', [
            'foreignKey' => 'user_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('Meals', [
            'foreignKey' => 'meal_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('Foods', [
            'foreignKey' => 'food_id',
            'joinType' => 'INNER'
        ]);

        $this->addBehavior('Search.Search');
        $this->searchManager()
            ->useCollection('default')
            ->add('user_id', 'Search.Value', [
                'field' => ['user_id'],
                'form' => [
                    'style' => 'min-width:200px;',
                    'class' => 'no-selectize'
                ],
            ]);
            
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator)
    {
        $validator
            ->integer('id')
            ->allowEmpty('id', 'create');


        $validator
            ->integer('quantity')
            ->requirePresence('quantity', 'create')
            ->notEmpty('quantity');

        return $validator;
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules)
    {
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        $rules->add($rules->existsIn(['meal_id'], 'Meals'));
        $rules->add($rules->existsIn(['food_id'], 'Foods'));

        return $rules;
    }
}
