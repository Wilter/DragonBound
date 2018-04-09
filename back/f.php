<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once ("fbsdk/facebook.php");
include ("/inc/class.mysql.php");


$config = array();
$config['appId'] = '544939225583113';
$config['secret'] = 'xxxxxxxxxxxxx-sex-xxxxxxxxxxxxxxx';
$config['fileUpload'] = false;

$facebook = new Facebook($config);

$user = $facebook->getUser();
$user_profile = array();

if ($user) {
    try {
        $user_profile = $facebook->api('/me');
    }
    catch (FacebookApiException $e) {
        $user = null;
    }
}

if ($user) {
    $sql = new MySQL('db_erwin', 'root', '123456');
    $id = $user_profile['id'];
    $name = $user_profile['name'];
    $gender = $user_profile['gender'];
    $sel = array("photo_url" => $id);
    $ss = $sql->Select("users", $sel);

    if (@$ss['user_id'] != "") {
        echo '[' . $ss['user_id'] . ',0,0,"283dcada42ce5321522c","PE"]';
    } else {
        if ($gender == "male")
            $gender = "m";
        else
            $gender = "f";

        $ins = array(
            "game_id" => $name,
            "room_number" => -1,
            "location_type" => 1,
            "rank" => 1,
            "gp" => 0,
            "gold" => 9999999,
            "cash" => 9999999,
            "gender" => $gender,
            "un_lock" => 1,
            "photo_url" => $id,
            "name_changes" => 1,
            "power_user" => 0,
            "tournament" => 0,
            "plus10gp" => 0,
            "mobile_fox" => 1,
            "country" => 1,
            "flowers" => 0,
            "position" => -1,
            "mobile" => 0,
            "is_master" => 0,
            "is_ready" => 0,
            "is_bot" => 0);
        $cor = $sql->Insert($ins, "users");
        $ss = $sql->Select("users", $sel);

        $idxx = $ss['user_id'];
        $ins = array(
            "relationship_status" => 0,
            "relationship_with_id" => 0,
            "relationship_with_rank" => 0,
            "relationship_with_photo" => "",
            "relationship_with_name" => "",
            "relationship_with_gender" => "",
            "user_id" => $idxx);
        $sql->Insert($ins, "relationship");

        $ins = array(
            "guild" => "TESTER",
            "guild_job" => 2,
            "user_id" => $idxx);
        $sql->Insert($ins, "guild_list");

        $ins = array(
            "head" => 1,
            "body" => 2,
            "eyes" => 0,
            "flag" => 0,
            "background" => 0,
            "foreground" => 0,
            "event1" => 0,
            "event2" => 0,
            "user_id" => $idxx);

        $sql->Insert($ins, "avatars");

        echo '[' . $idxx . ',0,0,"283dcada42ce5321522c","PE"]';
    }
} else {
    echo "[0]";
}
?>