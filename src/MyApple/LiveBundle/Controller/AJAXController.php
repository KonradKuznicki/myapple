<?php

namespace MyApple\LiveBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\HttpFoundation\Response;
use MyApple\LiveBundle\Form\EntryType;
use MyApple\LiveBundle\Form\PhotoType;

//use MyApple\LiveBundle\Model;

/**
 * @Route("/Admin/AJAX")
 */
class AJAXController extends Controller
{
	
	/**
	 * 
	 * @Route("/stats", name="ajax_stats")
	 */
	public function statsAction() 
	{
		
		$procesy = file_get_contents(__DIR__."/../../../../../resources.txt");
		
		$a = explode("\n", $procesy);
		
		$a_procesy = array();
		
		$a_dozwolone = array("nginx", "php-fpm");
		
		$params["ram"] = 0.0;
		$params["cpu"] = 0.0;
		
		foreach ($a as $t)
		{
			if(preg_match("/(\d\.\d).*(\d\.\d)/", $t, $match))
			{
				$ram = ((float)$match[1])*2048/256;
				$cpu = $match[2];

				$params["ram"] += $ram;
				$params["cpu"] += $cpu;
			
				foreach ($a_dozwolone as $dozwolone)
				{
					if (strpos($t, $dozwolone)) array_push($a_procesy, array("ram" => $ram, "cpu" => $cpu, "proces" => $dozwolone ));
				}
			}
		}
		
		$params["procesy"] = $a_procesy;
		
		
		$net = file_get_contents(__DIR__."/../../../../../traffic0.txt");
		if(stripos($net, "Traffic average") === false) $net = file_get_contents(__DIR__."/../../../../../traffic1.txt");
		if(stripos($net, "Traffic average") === false) $net = file_get_contents(__DIR__."/../../../../../traffic2.txt");

		preg_match_all("/((\d+(\.\d+)?) ([a-zA-Z]bit\/s))\s*((\d+(\.\d+)?) packets)/", $net, $match);
		
		$params["net"] = array(
			"rx" => array( 
				"rate" => $match[2][0],
				"unit" => $match[4][0],
				"packets" => $match[6][0]
			),
			
			"tx" => array( 
				"rate" => $match[2][1],
				"unit" => $match[4][1],
				"packets" => $match[6][1]
			)
		);
		
		//return new Response(print_r($match, true).print_r($net, true));
		return new Response(json_encode($params));
	}
	
	/**
	 * @Route("/entry", name="ajax_entry")
	 * @Template()
	 */
	public function entryAction() 
	{
		$success = false;
		try {	
			$entry = new \MyApple\LiveBundle\Model\EntryModel(
	    		$this->get('security.context')->getToken()->getUsername()
	    	);
	    	
	    	$form = $this->createForm(new EntryType(), $entry);
	    	
			$request = $this->get('request');
			if ($request->getMethod() == 'POST') {
				$form->bindRequest($request);
	
				if ($form->isValid()) {
					$entry->save();
				}
			}
			$success = true;
		} catch (\Exception $e){
			
		}
		return array('success' => $success);
	}

	/**
     * @Route("/photo", name="ajax_photo")
     * @Template()
     */
    public function photoAction()
    {
        //sleep(2);
		$success = false;
		try {
	        $photo = new \MyApple\LiveBundle\Model\PhotoModel(
	           // $this->get('security.context')->getToken()->getUsername()
	        );
	
	        $form = $this->createForm(new PhotoType(), $photo);
	
			$request = $this->get('request');
	            $form->bindRequest($request);
	
	            if ($form->isValid()) {
	                $photo->save();
	            } else {
					throw new \Exception("asdf");
				}
			$success = $photo->getPhoto();
		} catch (\Exception $e){
			
		}
        return array('success'=>$success);
    }	
	
}
