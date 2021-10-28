<?php
namespace App\Controller\Api;

use Cake\ORM\TableRegistry;

class ExportController extends AppController
{
    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['surveys']);
    }

    public function surveys()
    {
        $this->Surveys = TableRegistry::get('Surveys');

        $surveyIds = $this->request->getQuery('surveys');

       

        $surveys = $this->Surveys->find()->contain(['Items' => ['Pictures']]);

        if(isset($surveyIds)){
            $surveyIds = explode(',', $surveyIds);
            $surveys =  $surveys->where(['Surveys.id IN' => $surveyIds]);
        }

        $this->set('surveys', $surveys->toArray());
        $this->set('itemConfig', ITEM_CONFIG);

    }

}
