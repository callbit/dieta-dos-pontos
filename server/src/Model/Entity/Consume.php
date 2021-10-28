<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Consume Entity
 *
 * @property int $id
 * @property int $user_id
 * @property int $meal_id
 * @property int $food_id
 * @property string $unit
 * @property int $quantity
 * @property \Cake\I18n\FrozenTime $created
 * @property \Cake\I18n\FrozenTime $modified
 *
 * @property \App\Model\Entity\User $user
 * @property \App\Model\Entity\Meal $meal
 * @property \App\Model\Entity\Food $food
 */
class Consume extends Entity
{

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        'user_id' => true,
        'meal_id' => true,
        'food_id' => true,
        'unit' => true,
        'uuid' => true,
        'date' => true,
        'quantity' => true,
        'created' => true,
        'modified' => true,
        'user' => true,
        'meal' => true,
        'food' => true
    ];
}
