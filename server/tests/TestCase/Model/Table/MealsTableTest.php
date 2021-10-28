<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\MealsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\MealsTable Test Case
 */
class MealsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\MealsTable
     */
    public $Meals;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.meals',
        'app.consumes'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Meals') ? [] : ['className' => MealsTable::class];
        $this->Meals = TableRegistry::get('Meals', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Meals);

        parent::tearDown();
    }

    /**
     * Test initialize method
     *
     * @return void
     */
    public function testInitialize()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testValidationDefault()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
