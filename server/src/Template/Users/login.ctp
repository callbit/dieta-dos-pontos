<div class="container">
    <div class="row">
        <div class="col col-lg-4 offset-lg-4">
            <br clear="all" />
            <br clear="all" />
            <br clear="all" />
            <?= $this->Flash->render() ?>
            <?= $this->Flash->render('auth') ?>
            <br clear="all" />
        <?php
        echo $this->Form->create('Users');
        echo $this->Form->control('email');
        echo $this->Form->control('password');
        echo $this->Form->submit('Login', ['class' => 'btn-success btn-block', 'style'=>'margin:0px;']);
        ?>
        </div>
    </div>
</div>

