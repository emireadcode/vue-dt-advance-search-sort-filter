<?php namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class CardDistinctRecord extends ResourceController
{
    protected $format = 'json';

    protected $dateduplicatechecker = [];

    /*
        Payment – customer – store – inventory  – film – language 
                    |         |
                address   address
                    |         |
                  city      city
                    |         |
                  country   country
    */

    protected $clusters = [
        [['payment','customer'], ['customer_id', 'customer_id']],
        [['customer','store'], ['store_id', 'store_id']],
        [['store','inventory'],['store_id', 'store_id']],
        [['inventory', 'film'], ['film_id', 'film_id']],
        [['film', 'language'], ['language_id', 'language_id']],
        [['customer', 'address'], ['address_id', 'address_id']],
        [['store', 'address'], ['address_id', 'address_id']],
        [['address', 'city'], ['city_id', 'city_id']],
        [['city', 'country'], ['country_id', 'country_id']]
    ];

    /*protected $fields = [
        'payment' => ['payment_date', 'amount', 'visited_time'],
        'customer' => ['first_name', 'last_name', 'email', 'active', 'create_date'],
        //'store' => [],
        //'inventory' => [],
        'film' => ['title', 'description', 'release_year', 'rental_duration', 'rental_rate', 'length', 'replacement_cost', 'rating', 			'special_features'],
        'language' => ['name'],
        'address' => ['address', 'phone', 'postal_code'],
        'city' => ['city'],
        'country' => ['country']
    ];
    

   */


    protected $cards = [];

    private function mysqlTimeFormatMap() {
        return [
            "24-HOUR-CLOCK-WITHOUT-SECONDS-WITH-LEADING-ZERO" => "%H:%i",
            "24-HOUR-CLOCK-WITHOUT-SECONDS-WITHOUT-LEADING-ZERO" => "%k:%i",
            "12-HOUR-CLOCK-WITHOUT-SECONDS-WITH-LEADING-ZERO" => "%h:%i %p",
            "12-HOUR-CLOCK-WITHOUT-SECONDS-WITHOUT-LEADING-ZERO" => "%l:%i %p",
            "24-HOUR-CLOCK-WITH-SECONDS" => "%T",
            "12-HOUR-CLOCK-WITH-SECONDS" => "%r"
        ];
    }

    private function mysqlDateFormatMap() {
        return [
            //Big Endian Date Format (year, month, day)
            "yy/mm/dd" => "%y/%m/%d",
            "yy/mm/d" => "%y/%m/%e",
            "yy/m/dd" => "%y/%c/%d",
            "yy/m/d" => "%y/%c/%e",
            "yyyy/mm/dd" => "%Y/%m/%d",
            "yyyy/mm/d" => "%Y/%m/%e",
            "yyyy/m/dd" => "%Y/%c/%d",
            "yyyy/m/d" => "%Y/%c%e",
            "yyyy mmmm dd" => "%Y %M %d",
            "yyyy mmmm d" => "%Y %M %e",
            "yyyy mmm dd" => "%Y %b %d",
            "yyyy mmm d" => "%Y %b %e",
            "ddd, yyyy mmmm dd" => "%a, %Y %M %d",
            "ddd, yyyy mmmm d" => "%a, %Y %M %e",
            "ddd, yyyy mmm dd" => "%a, %Y %b %d",
            "ddd, yyyy mmm d" => "%a, %Y %b %e",
            "dddd, yyyy mmmm dd" => "%W, %Y %M %d",
            "dddd, yyyy mmmm d" => "%W, %Y %M %e",
            "dddd, yyyy mmm dd" => "%W, %Y %b %d",
            "dddd, yyyy mmm d" => "%W, %Y %b %e",
            "dddd yyyy mmmm dd" => "%W %Y %M %d",
            "dddd yyyy mmmm d" => "%W %Y %M %e",
            "dddd yyyy mmm dd" => "%W %Y %b %d",
            "dddd yyyy mmm d" => "%W %Y %b %e",
            "yy.mm.dd" => "%y.%m.%d",
            "yy.mm.d" => "%y.%m.%e",
            "yy.m.dd" => "%y.%c.%d",
            "yy.m.d" => "%y.%c.%e",
            "yyyy.mm.dd" => "%Y.%m.%d",
            "yyyy.mm.d" => "%Y.%m.%e",
            "yyyy.m.dd" => "%Y.%c.%d",
            "yyyy.m.d" => "%Y.%c.%e",
            "yy. mm. dd" => "%y. %m. %d",
            "yy. mm. d" => "%y. %m. %e",
            "yy. m. dd" => "%y. %c %d",
            "yy. m. d" => "%y. %c. %e",
            "yyyy. mm. dd" => "%Y. %m. %d",
            "yyyy. mm. d" => "%Y. %m. %e",
            "yyyy. m. dd" => "%Y. %c. %d",
            "yyyy. m. d" => "%Y. %c. %e",
            "yy-mm-dd" => "%y-%m-%d",
            "yy-mm-d" => "%y-%m-%e",
            "yy-m-dd" => "%y-%c-%d",
            "yy-m-d" => "%y-%c-%e",
            "yyyy-mm-dd" => "%Y-%m-%d",
            "yyyy-mm-d" => "%Y-%m-%e",
            "yyyy-m-dd" => "%Y-%c-%d",
            "yyyy-m-d" => "%Y-%c-%e",
            //little-endian (day, month, year)
            "dd/mm/yyyy" => "%d/%m/%Y",
            "dd/m/yyyy" => "%d/%c/%Y",
            "d/mm/yyyy" => "%e/%m/%Y",
            "d/m/yyyy" => "%e/%c/%Y",
            "dd/mm/yy" => "%d/%m/%y",
            "dd/m/yy" => "%d/%c/%y",
            "d/mm/yy" => "%e/%m/%y",
            "d/m/yy" => "%e/%c/%y",
            "d/m-yy" => "%e/%c-%yy",
            "d/m yyyy" => "%e/%c %Y",
            "dd mmm yyyy" => "%d %b %Y",
            "d mmm yyyy" => "%e %b %Y",
            "dd mmmm yyyy" => "%d %M %Y",
            "d mmmm yyyy" => "%e %M %Y",
            "dd mmm, yyyy" => "%d %b, %Y",
            "d mmm, yyyy" => "%e %b, %Y",
            "dd mmmm, yyyy" => "%d %M, %Y",
            "d mmmm, yyyy" => "%e %M, %Y",
            "dddd, dd mmmm yyyy" => "%W, %d %M %Y",
            "dddd, d mmmm yyyy" => "%W, %e %M %Y",
            "dddd, dd mmm yyyy" => "%W, %d %b %Y",
            "dddd, d mmm yyyy" => "%W, %e %b %Y",
            "ddd, dd mmmm yyyy" => "%a, %d %M %Y",
            "ddd, d mmmm yyyy" => "%a, %e %M %Y",
            "ddd, dd mmm yyyy" => "%a, %d %b %Y",
            "ddd, d mmm yyyy" => "%a, %e %b %Y",
            "dddd, dd mmmm, yyyy" => "%W, %d %M, %Y",
            "dddd, d mmmm, yyyy" => "%W, %e %M, %Y",
            "dddd, dd mmm, yyyy" => "%W, %d %b, %Y",
            "dddd, d mmm, yyyy" => "%W, %e %b, %Y",
            "ddd, dd mmmm, yyyy" => "%a, %d %M, %Y",
            "ddd, d mmmm, yyyy" => "%a, %e %M, %Y",
            "ddd, dd mmm, yyyy" => "%a, %d %b, %Y",
            "ddd, d mmm, yyyy" => "%a, %e %b, %Y",
            "dddd dd mmmm yyyy" => "%W %d %M %Y",
            "dddd d mmmm yyyy" => "%W %e %M %Y",
            "dddd dd mmm yyyy" => "%W %d %b %Y",
            "dddd d mmm yyyy" => "%W %e %b %Y",
            "ddd dd mmmm yyyy" => "%a %d %M %Y",
            "ddd d mmmm yyyy" => "%a %e %M %Y",
            "ddd dd mmm yyyy" => "%a %d %b %Y",
            "ddd d mmm yyyy" => "%a %e %b %Y",
            "dddd dd mmmm, yyyy" => "%W %d %M, %Y",
            "dddd d mmmm, yyyy" => "%W %e %M, %Y",
            "dddd dd mmm, yyyy" => "%W %d %b, %Y",
            "dddd d mmm, yyyy" => "%W %e %b, %Y",
            "ddd dd mmmm, yyyy" => "%a %d %M, %Y",
            "ddd d mmmm, yyyy" => "%a %e %M, %Y",
            "ddd dd mmm, yyyy" => "%a %d %b, %Y",
            "ddd d mmm, yyyy" => "%a %e %b, %Y",
            "dd.mm.yyyy" => "%d.%m.%Y",
            "d.mm.yyyy" => "%e.%m.%Y",
            "dd.m.yyyy" => "%d.%c.%Y",
            "d.m.yyyy" => "%e.%c.%Y",
            "dd. mm. yyyy" => "%d. %m. %Y",
            "d. mm. yyyy" => "%e. %m. %Y",
            "dd. m. yyyy" => "%d. %c. %Y",
            "d. m. yyyy" => "%e. %c. %Y",
            "dd.mm.yy" => "%d.%m.%y",
            "dd.m.yy" => "%d.%c.%y",
            "d.mm.yy" => "%e.%m.%y",
            "d.m.yy" => "%e.%c.%y",
            "dd. mm. yy" => "%d. %m. %y",
            "dd. m. yy" => "%d. %c. %y",
            "d. mm. yy" => "%e. %m. %y",
            "d. m. yy" => "%e. %c. %y",
            "d. mmmm yyyy" => "%e. %M %Y",
            "d. mmm yyyy" => "%e. %b %Y",
            "dd. mmmm yyyy" => "%d. %M %Y",
            "dd. mmm yyyy" => "%d. %b %Y",
            "dd-mm-yyyy" => "%d-%m-%Y",
            "dd-m-yyyy" => "%d-%c-%Y",
            "d-mm-yyyy" => "%e-%m-%Y",
            "d-m-yyyy" => "%e-%c-%Y",
            "dd-mm-yy" => "%d-%m-%y",
            "dd-m-yy" => "%d-%c-%y",
            "d-mm-yy" => "%e-%m-%y",
            "d-m-yy" => "%e-%c-%y",
            //middle-endian (month, day, year)
            "mm/dd/yyyy" => "%m/%d/%Y",
            "mm/d/yyyy" => "%m/%e/%Y",
            "m/dd/yyyy" => "%c/%d/%Y",
            "m/d/yyyy" => "%c/%e/%Y",
            "mm/dd/yy" => "%m/%d/%y",
            "mm/d/yy" => "%m/%e/%y",
            "m/dd/yy" => "%c/%d/%y",
            "m/d/yy" => "%c/%e/%y",
            "mmmm/dd/yyyy" => "%M/%d/%Y",
            "mmmm/d/yyyy" => "%M/%e/%Y",
            "mmm/dd/yyyy" => "%b/%d/%Y",
            "mmm/d/yyyy" => "%b/%e/%Y",
            "mm.dd.yyyy" => "%m.%d.%Y",
            "mm.d.yyyy" => "%m.%e.%Y",
            "m.dd.yyyy" => "%c.%d.%Y",
            "m.d.yyyy" => "%c.%e.%Y",
            "mm. dd. yyyy" => "%m. %d. %Y",
            "mm. d. yyyy" => "%m. %e. %Y",
            "m. dd. yyyy" => "%c. %d. %Y",
            "m. d. yyyy" => "%c. %e. %Y",
            "dddd mmmm dd yyyy" => "%W %M %d %Y",
            "dddd mmmm d yyyy" => "%W %M %e %Y",
            "dddd mmm dd yyyy" => "%W %b %d %Y",
            "dddd mmm d yyyy" => "%W %b %e %Y",
            "ddd mmmm dd yyyy" => "%a %M %d %Y",
            "ddd mmmm d yyyy" => "%a %M %e %Y",
            "ddd mmm dd yyyy" => "%a %b %d %Y",
            "ddd mmm d yyyy" => "%a %b %e %Y",
            "dddd, mmmm dd yyyy" => "%W, %M %d %Y",
            "dddd, mmmm d yyyy" => "%W, %M %e %Y",
            "dddd, mmm dd yyyy" => "%W, %b %d %Y",
            "dddd, mmm d yyyy" => "%W, %b %e %Y",
            "ddd, mmmm dd yyyy" => "%a, %M %d %Y",
            "ddd, mmmm d yyyy" => "%a, %M %e %Y",
            "ddd, mmm dd yyyy" => "%a, %b %d %Y",
            "ddd, mmm d yyyy" => "%a, %b %e %Y",
            "dddd, mmmm dd, yyyy" => "%W, %M %d, %Y",
            "dddd, mmmm d, yyyy" => "%W, %M %e, %Y",
            "dddd, mmm dd, yyyy" => "%W, %b %d, %Y",
            "dddd, mmm d, yyyy" => "%W, %b %e, %Y",
            "ddd, mmmm dd, yyyy" => "%a, %M %d, %Y",
            "ddd, mmmm d, yyyy" => "%a, %M %e, %Y",
            "ddd, mmm dd, yyyy" => "%a, %b %d, %Y",
            "ddd, mmm d, yyyy" => "%a, %b %e, %Y",
            "mmmm dd, yyyy" => "%M %d, %Y",
            "mmmm d, yyyy" => "%M %e, %Y",
            "mmm dd, yyyy" => "%b %d, %Y",
            "mmm d, yyyy" => "%b %e, %Y",
            "mm-dd-yyyy" => "%m-%d-%Y",
            "mm-d-yyyy" => "%m-%e-%Y",
            "m-dd-yyyy" => "%c-%d-%Y",
            "m-d-yyyy" => "%c-%e-%Y",
            "mm-dd-yy" => "%m-%d-%y",
            "mm-d-yy" => "%m-%e-%y",
            "m-dd-yy" => "%c-%d-%y",
            "m-d-yy" => "%c-%e-%y",
            "mmmm-dd-yyyy" => "%M-%d-%Y",
            "mmmm-d-yyyy" => "%M-%e-%Y",
            "mmm-dd-yyyy" => "%b-%d-%Y",
            "mmm-d-yyyy" => "%b-%e-%Y"
        ];
    }

    private function getCardKey($multipletype) {
        return preg_replace('/\s+/', '', strtolower($multipletype['name']));
    }

    private function isConcatenated($multipletype) {
        if(array_key_exists("concatenated", $multipletype)) {
            return true;
        }
        return false;
    }

    private function isJoined($firstfield) {
        if(array_key_exists("join", $firstfield)) {
            return true;
        }
        return false;
    }

    private function formSingles($multipletype, $datatype) {
        if(array_key_exists("attribute", $multipletype)) {
            if($datatype === 'datetypes' || $datatype === 'datetimetypes' || $datatype === 'timetypes') {
                if($datatype === 'datetypes')
                    return [
                        $multipletype['attribute'],
                        $multipletype['table'],
                        $datatype,
                        ['dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]
                    ];
                else if($datatype === 'datetimetypes')
                    return [
                        $multipletype['attribute'],
                        $multipletype['table'],
                        $datatype, 
                        [
                            'timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]], 
                            'dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]
                        ]
                    ];
                else
                    return [
                        $multipletype['attribute'],
                        $multipletype['table'],
                        $datatype, 
                        ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]]]
                    ];
            }
            else {
                return [
                    $multipletype['attribute'],
                    $multipletype['table'],
                    $datatype
                ];
            }
        }
        else {
            if($datatype === 'datetypes' || $datatype === 'datetimetypes' || $datatype === 'timetypes') {
                if($datatype === 'datetypes')
                    return [
                        $multipletype['table'],
                        $datatype,
                        ['dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]
                    ];
                else if($datatype === 'datetimetypes')
                    return [
                        $multipletype['table'],
                        $datatype, 
                        [
                            'timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]], 
                            'dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]
                        ]
                    ];
                else
                    return [
                        $multipletype['table'],
                        $datatype, 
                        ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]]]
                    ];
            }
            else {
                return [
                    $multipletype['table'],
                    $datatype
                ];
            }
        }
    }

    private function formJoinWithoutConcatenation($multipletype, $clusters, $datatype) {
        $field = preg_replace('/\s+/', '', strtolower($multipletype['name']));
        if(array_key_exists("attribute", $multipletype)) {
            $field = $multipletype['attribute'];
        }
        $clusterlink = [$multipletype['join'], $multipletype['table']];
        $tableHolder = [];
        foreach($clusters as $cluster) {
            if($cluster[0] === $clusterlink) {
                $tableAndJoinKey = [];
                $tableAndJoinKey[] = [$clusterlink[0], $cluster[1][0]];
                $tableAndJoinKey[] = [$clusterlink[1], $cluster[1][1]];
                $tableHolder = $tableAndJoinKey;
            }
        }
        if($datatype === 'datetypes' || $datatype === 'datetimetypes' || $datatype === 'timetypes') {
            if($datatype === 'datetypes')
                return [$field, $tableHolder, $datatype, ['dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
            else if($datatype === 'datetimetypes')
                return [$field, $tableHolder, $datatype, ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]], 'dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
            else
                return [$field, $tableHolder, $datatype, ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]]]];
        }
        else {
            return [$field, $tableHolder, $datatype];
        }
    }

    private function attachModifiersOrNot($datatype, $fields) {
        if($datatype === 'numberstringtypes' || $datatype === 'singlewordstringtypes') {
            if(array_key_exists("startmodifierwildcard", $fields) || array_key_exists("endmodifierwildcard", $fields)) {
                if(array_key_exists("startmodifierwildcard", $fields) && array_key_exists("endmodifierwildcard", $fields)) {
                    if(array_key_exists('attribute', $fields)) {
                        return "'".$fields['startmodifierwildcard']."', ".$fields['attribute'].", '".$fields['endmodifierwildcard']."'";
                    }
                    else {
                        return "'".$fields['startmodifierwildcard']."', ".preg_replace('/\s+/', '', strtolower($fields['name'])).", '".$fields['endmodifierwildcard']."'";
                    }
                }
                else {
                    if(array_key_exists("startmodifierwildcard", $fields)) {
                        if(array_key_exists('attribute', $fields)) {
                            return "'".$fields['startmodifierwildcard']."', ".$fields['attribute'];
                        }
                        else {
                            return "'".$fields['startmodifierwildcard']."', ".preg_replace('/\s+/', '', strtolower($fields['name']));
                        }
                    }
                    else {
                        if(array_key_exists('attribute', $fields)) {
                            return $fields['attribute'].", '".$fields['endmodifierwildcard']."'";
                        }
                        else {
                            return preg_replace('/\s+/', '', strtolower($fields['name'])).", '".$fields['endmodifierwildcard']."'";
                        }
                    }
                }
            }
            else {
                if(array_key_exists('attribute', $fields)) {
                    return $fields['attribute'];
                }
                else {
                    return preg_replace('/\s+/', '', strtolower($fields['name']));
                }
            }
        }
        else {
            if(array_key_exists('attribute', $fields)) {
                return $fields['attribute'];
            }
            else {
                return preg_replace('/\s+/', '', strtolower($fields['name']));
            }
        }
    }

    private function isOnlySameTableAndJoinPairInCluster($fields) {
        $size = 0;
        for($i = 0; $i < count($fields); $i++) {
            if($fields[0]['join'] === $fields[$i]['join'] && $fields[0]['table'] === $fields[$i]['table']) {
                $size++;
            }
        }
        if($size === count($fields))
            return true;
        else
            return false;
    }

    private function isDuplicateTableAndJoinPairInCluster($fields) {
        $size = 0;
        $duplicate = [];
        for($i = 0; $i < count($fields); $i++) {
            if($fields[0]['join'] === $fields[$i]['join'] && $fields[0]['table'] === $fields[$i]['table']) {
                $size++;
                $duplicate = [$fields[0]['join'], $fields[0]['table']];
            }
        }
        if($size > 1 && $size < count($fields))
            return [true, $duplicate];
        else
            return [false, $duplicate];
    }

    private function formConcatenationViaOrWithoutJoin($multipletype, $concatenationtype, $clusters, $datatype) {
        $fields = $multipletype['concatenated']['fields'];
        $delimiters = $multipletype['concatenated']['delimiters'];
        $pairHolder = [];
        
        for($i = 0; $i < count($fields); $i++) {
            $pairHolder[] = $this->attachModifiersOrNot($datatype, $fields[$i]);
            
            if(is_array($delimiters)) {
                if($i<count($delimiters)) {
                    $pairHolder[] = ", '$delimiters[$i]', ";
                }
            }
            else {
                if($i<count($fields)-1) {
                    $pairHolder[] = ", '$delimiters', ";
                }
            }
        }
        if($concatenationtype === 'CONCATENATION-VIA-JOIN') {
            $tableHolder = [];
            if($this->isOnlySameTableAndJoinPairInCluster($fields)) {
                foreach($clusters as $cluster) {
                    if($cluster[0] === [$fields[0]['join'], $fields[0]['table']]) {
                        $tableAndJoinKey = [];
                        $tableAndJoinKey[] = [$fields[0]['join'], $cluster[1][0]];
                        $tableAndJoinKey[] = [$fields[0]['table'], $cluster[1][1]];
                        $tableHolder = $tableAndJoinKey;
                        break;
                    }
                }
            }
            else {
                $isduplicate = $this->isDuplicateTableAndJoinPairInCluster($fields);
                if($isduplicate[0]) {
                    foreach($clusters as $cluster) {
                        if($cluster[0] === $isduplicate[1]) {
                            $tableAndJoinKey = [];
                            $tableAndJoinKey[] = [$isduplicate[1][0], $cluster[1][0]];
                            $tableAndJoinKey[] = [$isduplicate[1][1], $cluster[1][1]];
                            $tableHolder[] = $tableAndJoinKey;
                            break;
                        }
                    }
                    for($i = 0; $i < count($fields); $i++) {
                        if($fields[$i]['join'] !== $isduplicate[1][0] || $fields[$i]['table'] !== $isduplicate[1][1]) {
                            $clusterlink = [$fields[$i]['join'], $fields[$i]['table']];
                            foreach($clusters as $cluster) {
                                if($cluster[0] === $clusterlink) {
                                    $tableAndJoinKey = [];
                                    $tableAndJoinKey[] = [$clusterlink[0], $cluster[1][0]];
                                    $tableAndJoinKey[] = [$clusterlink[1], $cluster[1][1]];
                                    $tableHolder[] = $tableAndJoinKey;
                                }
                            }
                        }
                    }
                }
                else {
                    for($i = 0; $i < count($fields); $i++) {
                        $clusterlink = [$fields[$i]['join'], $fields[$i]['table']];
                        foreach($clusters as $cluster) {
                            if($cluster[0] === $clusterlink) {
                                $tableAndJoinKey = [];
                                $tableAndJoinKey[] = [$clusterlink[0], $cluster[1][0]];
                                $tableAndJoinKey[] = [$clusterlink[1], $cluster[1][1]];
                                $tableHolder[] = $tableAndJoinKey;
                            }
                        }
                    }
                }
            }

            if($datatype === 'datetypes' || $datatype === 'datetimetypes' || $datatype === 'timetypes') {
                if($datatype === 'datetypes')
                    return [$pairHolder, $tableHolder, $datatype,['dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
                else if($datatype === 'datetimetypes')
                    return [$pairHolder, $tableHolder, $datatype,['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]], 'dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
                else
                    return [$pairHolder, $tableHolder, $datatype, ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]]]];
            }
            else {
                return [$pairHolder, $tableHolder, $datatype];
            }
        }
        else {
            if($datatype === 'datetypes' || $datatype === 'datetimetypes' || $datatype === 'timetypes') {
                if($datatype === 'datetypes')
                    return [$pairHolder, $fields[0]['table'], $datatype, ['dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
                else if($datatype === 'datetimetypes')
                    return [$pairHolder, $fields[0]['table'], $datatype, ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]], 'dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
                else
                    return [$pairHolder, $fields[0]['table'], $datatype, ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]]]];
            }
            else {
                return [$pairHolder, $fields[0]['table'], $datatype];
            }
        }
    }

    private function createCards($config, $clusters) {
        $cards = [];
        foreach($config as $key => $value) {
            foreach($value as $multipletype) {
                $cardkey = $this->getCardKey($multipletype);
                if($this->isConcatenated($multipletype)) {
                    if($this->isJoined($multipletype['concatenated']['fields'][0])) {
                        //concatenation via join
                        $cards["$cardkey"] = [
                            'concatenation_via_join' => $this->formConcatenationViaOrWithoutJoin($multipletype, 'CONCATENATION-VIA-JOIN', $clusters, $key)
                        ];
                    }
                    else {
                        //concatenation without join
                        $cards["$cardkey"] = [
                            'concatenation_without_join' => $this->formConcatenationViaOrWithoutJoin($multipletype, 'CONCATENATION-WITHOUT-JOIN', $clusters, $key)
                        ];
                    }
                }
                else {
                    if($this->isJoined($multipletype)) {
                        //join without concatenation
                        $cards["$cardkey"] = [
                            'join_without_concatenation' => $this->formJoinWithoutConcatenation($multipletype, $clusters, $key)
                        ];
                    }
                    else {
                        //no join no concatenation = single
                        $cards["$cardkey"] = [
                            'single' => $this->formSingles($multipletype, $key)
                        ];
                    }
                }
            }
        }
        return $cards;
    }
    
    private function formConcatString($pointers) {
        $index = 0;
        $concatenation = 'concat(';
        foreach($pointers as $pointer) {
            $concatenation.=$pointers[$index];
            $index++;
            if($index === count($pointers)) {
                $concatenation.=')';
            }
        }
        return $concatenation;
    }

    private function formColumnJoinString($pointer1) {
        $tablejoin = '';
        foreach($pointer1 as $pointer) {
            if($tablejoin === '') {
                if(!is_array($pointer[0])) {
                    $tablejoin.=$pointer1[0][0].' inner join '.$pointer1[1][0].' on '.$pointer1[0][0].'.'.$pointer1[0][1].' = '.$pointer1[1][0].'.'.$pointer1[1][1];
                    break;
                }
                else {
                    $tablejoin.=$pointer[0][0].' inner join '.$pointer[1][0].' on '.$pointer[0][0].'.'.$pointer[0][1].' = '.$pointer[1][0].'.'.$pointer[1][1];
                }
            }
            else {
                $tablejoin.=' inner join '.$pointer[1][0].' on '.$pointer[0][0].'.'.$pointer[0][1].' = '.$pointer[1][0].'.'.$pointer[1][1];
            }
        }
        return $tablejoin;
    }

    public function getCardDistinctRecord() {

        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST,GET, OPTIONS');
        header('Access-Control-Allow-Headers: *');

	$config = json_decode($this->request->getPost('config'), true);

        $this->cards = $this->createCards($config, $this->clusters);

        //print_r($this->cards);

        $distinctrecords = [];

        $db = \Config\Database::connect();

        foreach($this->cards as $key => $value) {
    
            $sql = '';

            $maxminsql = '';

            $datatype = '';

            if(array_key_exists('concatenation_via_join', $value)) {
                //concatenation via join

                $datatype = $value['concatenation_via_join'][2];

                $concatenation = $this->formConcatString($value['concatenation_via_join'][0]);
                $tablejoin = $this->formColumnJoinString($value['concatenation_via_join'][1]);
                $sql = "SELECT DISTINCT $concatenation AS 'row' from $tablejoin";
                
                if($datatype==='numberstringtypes' || $datatype==='timetypes' || $datatype==='datetypes' || $datatype==='datetimetypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                    $maxminsql = "SELECT MAX(".$concatenation.") AS 'max', MIN(".$concatenation.") as 'min' from ".$tablejoin;
                }
            }
            else if(array_key_exists('concatenation_without_join', $value)) {
                //concatenation without join

                $datatype = $value['concatenation_without_join'][2];

                $concatenation = $this->formConcatString($value['concatenation_without_join'][0]);
                $sql = "SELECT DISTINCT $concatenation AS 'row' from ".$value['concatenation_without_join'][1];
                
                if($datatype==='numberstringtypes' || $datatype==='timetypes' || $datatype==='datetypes' || $datatype==='datetimetypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                    $maxminsql = "SELECT MAX(".$concatenation.") AS 'max', MIN(".$concatenation.") as 'min' from ".$tablejoin;
                }
            }
            else if(array_key_exists('join_without_concatenation', $value)) {
                //join_without_concatenation

                $datatype = $value['join_without_concatenation'][2];

                $tablejoin = $this->formColumnJoinString($value['join_without_concatenation'][1]);

                if($datatype === 'timetypes' || $datatype === 'datetypes' || $datatype === 'datetimetypes') {
                    if($datatype === 'timetypes') {
                        $timeFormat = $value['join_without_concatenation'][3]['timeformat'];
                        $field = $value['join_without_concatenation'][0];

                        $maxminsql = "SELECT DATE_FORMAT(MAX($field), $timeFormat)) AS 'max', DATE_FORMAT(MIN($field), $timeFormat)) as 'min' from $tablejoin";
                        $sql = "SELECT DISTINCT DATE_FORMAT($field, '$timeFormat') AS 'row' from $tablejoin";
                    }
                    else if($datatype === 'datetypes') {
                        $dateFormat = $value['join_without_concatenation'][3]['dateformat'];
                        $field = $value['join_without_concatenation'][0];

                        $maxminsql = "SELECT DATE_FORMAT(MAX($field), '%Y-%m-%d')) AS 'max', DATE_FORMAT(MIN($field), '%Y-%m-%d')) as 'min' from $tablejoin";
                        $sql = "SELECT DISTINCT DATE_FORMAT($field, '$dateFormat') AS 'row' from $tablejoin";
                    }
                    else {
                        $datetimeFormat = $value['join_without_concatenation'][3]['dateformat'].'__O__'.$value['join_without_concatenation'][3]['timeformat'];
                        $field = $value['join_without_concatenation'][0];

                        $maxminsql = "SELECT DATE_FORMAT(MAX($field), '%Y-%m-%d')) AS 'max', DATE_FORMAT(MIN($field), '%Y-%m-%d')) as 'min' from $tablejoin";
                        $sql = "SELECT DISTINCT DATE_FORMAT($field, '$datetimeFormat') AS 'row' from $tablejoin";
                    }
                }
                else {
                    $sql = 'SELECT DISTINCT '.$value['join_without_concatenation'][0]." AS 'row' from $tablejoin";
                
                    if($datatype==='numberstringtypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                        $maxminsql = "SELECT MAX(".
                            $value['join_without_concatenation'][0].
                        ") AS 'max', MIN(".
                            $value['join_without_concatenation'][0].
                        ") as 'min' from ".$tablejoin;
                    }
                }
            }
            else {
                if(count($value['single']) === 2) {
                    $datatype = $value['single'][1];

                    $sql = "SELECT DISTINCT $key AS 'row' from ".$value['single'][0];

                    if($datatype==='numberstringtypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                        $maxminsql = "SELECT MAX($key) AS 'max', MIN($key) as 'min' from ".$value['single'][0];
                    }
                }
                else {
                    $field = "";
                    $table = "";
                    if(count($value['single']) === 3) {
                        if(is_array($value['single'][2])) {
                            $datatype = $value['single'][1];
                            $field = $key;
                            $table = $value['single'][0];
                        }
                        else {
                            $datatype = $value['single'][2];
                            $field = $value['single'][0];
                            $table = $value['single'][1];
                        }
                    }
                    else {
                        $datatype = $value['single'][2];
                        $field = $value['single'][0];
                        $table = $value['single'][1];
                    }

                    if($datatype === 'timetypes' || $datatype === 'datetypes' || $datatype === 'datetimetypes') {
                        if($datatype === 'timetypes') {
                            $timeFormat = $value['single'][count($value['single'])-1]['timeformat'];
                            $sql = "SELECT DISTINCT DATE_FORMAT($field, '$timeFormat') AS 'row' from $table";
                            $maxminsql = "SELECT DATE_FORMAT(MAX($field), '$timeFormat') AS 'max', DATE_FORMAT(MIN($field), '$timeFormat') as 'min' from $table";
                        }
                        else if($datatype === 'datetypes') {
                            $dateFormat = $value['single'][count($value['single'])-1]['dateformat'];
                            $sql = "SELECT DISTINCT DATE_FORMAT($field, '$dateFormat') AS 'row' from $table";
                            $maxminsql = "SELECT DATE_FORMAT(MAX($field), '%Y-%m-%d') AS 'max', DATE_FORMAT(MIN($field), '%Y-%m-%d') as 'min' from $table";
                        }
                        else {
                            $datetimeFormat = $value['single'][count($value['single'])-1]['dateformat'].'__O__'.$value['single'][count($value['single'])-1]['timeformat'];
                            $sql = "SELECT DISTINCT DATE_FORMAT($field, '$datetimeFormat') AS 'row' from $table";
                            $maxminsql = "SELECT DATE_FORMAT(MAX($field), '%Y-%m-%d') AS 'max', DATE_FORMAT(MIN($field), '%Y-%m-%d') as 'min' from $table";
                        }
                    }
                    else {
                        $sql = "SELECT DISTINCT $field AS 'row' from $table";
                        if($datatype==='numberstringtypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                            $maxminsql = "SELECT MAX($field) AS 'max', MIN($field) as 'min' from $table";
                        }
                    }
                }
            }
            
            /*
            print_r("\n==================\n");
            print_r($sql);
            print_r("\n==================\n");
            print_r($maxminsql);
            print_r("\n==================\n");
            */

            $query = $db->query($sql);
                
            $data = [];

            foreach($query->getResult() as $r) {
                $data[] = [
                    'row' => $r->row,
                    'checked' => false,
                    'selected' => false
                ];
            }
    
            if($datatype==='numberstringtypes' || $datatype==='timetypes' || $datatype==='datetypes' || $datatype==='datetimetypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                $query1 = $db->query($maxminsql);
                $distinctrecords["$key"] = [
                    'data' => $data,
                    'total' => count($query->getResult()),
                    'offset' => 2,
                    'max' => $query1->getResult()[0]->max,
                    'min' => $query1->getResult()[0]->min
                ];
            }
            else {
                $distinctrecords["$key"] = [
                    'data' => $data,
                    'total' => count($query->getResult()),
                    'offset' => 2
                ];
            }
        }
        
        $db->close();

		return $this->respond($distinctrecords);        
    }
}
