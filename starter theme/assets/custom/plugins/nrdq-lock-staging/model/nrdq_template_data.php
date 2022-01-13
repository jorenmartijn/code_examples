<?php

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

class NRDQ_Template_Data extends \NRDQ_LockStaging\Model{


    protected $fillable = [

        'id',
        'time'

    ];

    public function oncreate(){
        $this->set('time', date('Y-m-d H:i:s'));
    }
}


?>