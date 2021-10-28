<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ConsumesTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ConsumesTable Test Case
 */
class ConsumesTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ConsumesTable
     */
    public $Consumes;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.consumes',
        'app.users',
        'app.meals',
        'app.foods'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Consumes') ? [] : ['className' => ConsumesTable::class];
        $this->Consumes = TableRegistry::get('Consumes', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Consumes);

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

    /**
     * Test buildRules method
     *
     * @return void
     */
    public function testBuildRules()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
