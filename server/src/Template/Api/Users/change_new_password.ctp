
<div class="applayout">
    <?= $this->Html->image('logo.png', ['class' => 'logo']) ?>
    <?php if(!$erro && $msg == ''){ ?>
    <fieldset>
        <h4><?= 'Alteração de senha'; ?></h4>
        <p>Para alterar sua senha, digite uma nova senha e clique no botão Alterar minha senha.</p>
    <?php
        echo $this->Form->create("User");
        echo $this->Form->input("new_pass", array(
            "label" => "Nova senha",
            "type" => "password",
            "required" => true,
            "div" => array('class' => 'required'),
            "autocomplete" => "off"
        ));
        echo $this->Form->input("new_pass_confirm", array(
            "label" => "Confirmar nova senha",
            "type" => "password",
            "required" => true,
            "div" => array('class' => 'required'),
            "autocomplete" => "off"
        ));
        echo $this->Form->button("Alterar minha senha", array("type" => "submit"));
    echo $this->Form->end();
    ?>
    </fieldset>
    <?php } ?>
    <?php if(!$erro && $msg != ''){ ?>
    <h4>Senha alterada!</h4>
    <p><?php echo $msg ?></p>
    <?php } ?>
    <?php if($erro){ ?>
    <h4>Erro!</h4>
    <p><?php echo $erro ?></p>
    <?php } ?>

</div>