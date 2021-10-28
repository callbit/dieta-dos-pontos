<?php

?>
<h1>Seyconel</h1>
<?php
$lastSurvey = end($surveys);
foreach ($surveys as $sk => $survey) {
    ?>
    <div class="survey">
        <?php
        $lastItem = end($survey['items']);

foreach ($survey['items'] as $k => $item) {
        ?>
            <h2><?=$survey['name'];?></h2>
            <div class="item <?php echo ($lastSurvey['id'] === $survey['id'] && $lastItem['id'] === $item['id']) ? 'item-last' : '' ?>">
                <h3><?=$itemConfig[$item['item_type']]['name'];?></h3>
                <?php
$jsonValue = json_decode($item['item_data'], true);
        $aprooved = (isset($jsonValue['aprooved']) && $jsonValue['aprooved']) ? 'Sim' : 'Não';
        ?>
                <p>
                    Aprovado: <?=$aprooved?> <br />
                </p>
                <div class="picture">
                <?php foreach ($item['pictures'] as $picture) {?>
                        <?php echo $this->Html->image('../files/Pictures/file/' . $picture['file'], ['width' => '300', 'fullBase' => true]); ?>
                <?php }?>
                </div>
            </div>
        <?php }?>
    </div>
<?php }?>