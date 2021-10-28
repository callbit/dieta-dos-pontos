<?php

$json = '[{"name":"Linga de corrente (NR-11/NBR 15516 1 e 2/NBR ISO 3076/NBR ISO 1834","itemType":1,"fields":["sector","length","description","extensions","initial_element","connection_element","end_element","internal_stretching","external_stretching","nominal_diameter","deformation","cracks","nameplate","observation","traceability","aprooved"]},{"name":"Eslingas, cintas planas e tubulares","itemType":2,"fields":["sector","length","description","extensions","capacity","eyelets_damage","body_seam_damage","main_seam_damage","cuts","abrasion","initial_element","connection_element","end_element","nameplate","observation","traceability","aprooved"]},{"name":"Acessórios","itemType":3,"fields":["sector","description","capacity","identification","deformation","stretching","latches","observation","traceability","aprooved"]},{"name":"Garras de elevação (NR-11)","itemType":4,"fields":["sector","description","capacity","deformation","came_damage","eyelet_damage","latch_damage","pine_damage","observation","traceability","aprooved"]},{"name":"Levantador magnético (NR 11)","itemType":5,"fields":["sector","description","capacity","eyelet_damage","external_structure_damage","lever_damage","lower_base_damage","observation","traceability","aprooved"]},{"name":"Dispositivos Especiais:(NR 11)","itemType":5,"fields":["sector","description","capacity","technical_drawing","measures_match_drawing","deformation","eyelet_fine","observation","traceability","aprooved"]},{"name":"Lingas e Laços de cabos de aço","itemType":6,"fields":["sector","description","capacity","length","diameter","extensions","initial_element","connection_element","end_element","legible_load_id","broken_wire","leg_break","crumpled","deformation","excessive_wear","heat_damage","elasticity_reduction","observation","traceability","aprooved"]}]';

$res = json_decode($json, true);

$final = "[
";

foreach ($res as $rs) {
    $final .= "[
";
    foreach ($rs as $k => $r) {
        if(!is_array($r)){
            $final .= "'" . $k . "' => '".$r."',
";
        } else {
            $items = implode("','", $r);
            $final .= "'" . $k . "' => ['".$items."'],
";
        }
       
    }

    $final .= "],
";
}
$final .= "]";

echo ($final);
