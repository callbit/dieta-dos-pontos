<div style="text-align:center;">
    <?= $this->Html->image('http://callbit.online/app/dietapontos/img/logo.png', ['style' => 'width:96px; margin: 20px auto; display: block; text-align:center; ']) ?>
    <br />
    <h4 style="font-size: 18px; color: #000; line-height: 1.6em;">Recuperar senha do Dieta dosPontos</h4>
    <p style="font-size: 14px; color: #999; line-height: 1.6em;">Para recuperar sua senha, entre no link abaixo e altere sua senha:</p>
    <br />
    <strong><?php echo $this->Html->link($link, $link, array("style" => "color: #666;", "target" => "_blank")); ?></strong>
    <br />
     <p style="font-size: 12px; color: #fff; line-height: 1.6em;">Esse link tem a validade de 48 horas e após esse período será necessário uma nova requisição.</p>
</div>