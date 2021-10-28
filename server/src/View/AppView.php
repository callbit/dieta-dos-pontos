<?php

namespace App\View;

use BootstrapUI\View\UIView;
use Cake\View\View;

class AppView extends UIView
{

    public function initialize()
    {
        $this->initializeUI(['layout' => false]);
    }
}
