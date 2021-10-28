<?php
namespace App\Model\Entity;

use Cake\Auth\DefaultPasswordHasher; // Add this line

use Cake\ORM\Entity;

/**
 * User Entity
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property bool $verified
 * @property string $token
 * @property \Cake\I18n\FrozenTime $created
 * @property \Cake\I18n\FrozenTime $modified
 */
class User extends Entity
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
        'name' => true,
        'email' => true,
        'gender' => true,
        'dob' => true,
        'weight' => true,
        'height' => true,
        'activity_level' => true,
        'password' => true,
        'verified' => true,
        'token' => true,
        'token_exp' => true,
        'created' => true,
        'modified' => true,
    ];

    protected function _setPassword($value)
    {
        if (strlen($value)) {
            $hasher = new DefaultPasswordHasher();

            return $hasher->hash($value);
        }
    }

    /**
     * Fields that are excluded from JSON versions of the entity.
     *
     * @var array
     */
    protected $_hidden = [
        'password',
        'token',
    ];

    protected function _getPointsPerDay()
    {
        return $this->calculatePointsIdeal($this->_properties);
    }

    protected function _getImc()
    {
        return $this->calculateImc($this->_properties);
    }

    public function calculateAge($user)
    {
        if ($user && $user['dob']) {
            $birthDate = date('d/m/Y', strtotime($user['dob']));
            $birthDate = explode("/", $birthDate);
            $age = (date("md", date("U", mktime(0, 0, 0, $birthDate[0], $birthDate[1], $birthDate[2]))) > date("md")
                ? ((date("Y") - $birthDate[2]) - 1)
                : (date("Y") - $birthDate[2]));
            return $age;
        }
        return 0;
    }

    public function toFixed($number, $decimals)
    {
        return number_format($number, $decimals, ".", "");
    }

    public function calculateImc($user)
    {
        if ($user && $user['height']) {
            $height = ($user['height'] / 100);
            return $this->toFixed(($user['weight'] / ($height * $height)), 1);
        }
        return 0;
    }

    public function calculateIdealWeight($user)
    {
        if (!$user['height']) {
            return [0, 0];
        }
        return [$this->toFixed($this->calculateIdealWeightMin($user['height']), 1), $this->toFixed($this->calculateIdealWeightMax($user['height']), 1)];
    }

    public function calculatePointsIdeal($user)
    {
        $height = $user['height'];
        $age = $this->calculateAge($user);
        $gender = ($user['gender'] === 'male' ? 0 : 1);
        $excercise = $user['activity_level'];
        $maxIdeal = $this->calculateIdealWeightMax($height);
        $minIdeal = $this->calculateIdealWeightMin($height);
        $avgIdeal = round(($maxIdeal + $minIdeal) / 2);
        $energy = $this->calculateEnergyLimitNew($avgIdeal, $height, $age, $gender, $excercise);
        $maxPoints = max($energy - 1000, 1000);
        $maxPoints = min($maxPoints, 2500) / 35;
        $maxPoints = max($maxPoints - 11, 26);
        $maxPoints = round(min($maxPoints, 71));
        return $maxPoints;
    }

    public function calculateIdealWeightMax($heigth)
    {
        return 24.99 * ($heigth / 100 * $heigth / 100);
    }

    public function calculateIdealWeightMin($heigth)
    {
        return 18.05 * ($heigth / 100 * $heigth / 100);
    }

    public function calculateEnergyLimitNew($weigth, $height, $age, $gender, $excercise)
    {
        if ($height > 3) {
            $height = $height / 100;
        }
        $arrayExercicio = [
            1.2, 1.3, 1.4, 1.5, 1.6, 1.8,
            1.2, 1.3, 1.35, 1.45, 1.5, 1.7,
        ];
        $pSex = ($gender === 0) ? 0 : 6;
        $factorActivity = $arrayExercicio[$excercise + $pSex];
        $limit = ($gender == 0) ?
        (864 - (9.72 * $age) + $factorActivity * ((14.2 * $weigth) + ($height * 503)))
        : (387 - (7.31 * $age) + $factorActivity * ((10.9 * $weigth) + ($height * 660.7)));
        return $limit - (0.09 * $limit) + 200;

    }
}
