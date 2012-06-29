<?php

use Doctrine\DBAL\Types\StringType;
namespace MyApple\LiveBundle\Model;

use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\ExecutionContext;

/**
 * 
 * No description
 * 
 * @author k_2
 */
class PhotoModel 
{
	
	private static $folder_photos = "photos";
	
	private $photo_name;
	private $photo_path;
	
	public function __construct()
	{
		$this->photo_name = md5(rand().time());
	}
	

	public function save()
	{
		if($this->photo_path) 
		{
			new ImageModel($this->photo_path, $this->photo_name);
		}	
	}

	public function getPhoto()
	{
		return $this->photo_name;
	}
	
	public function setPhoto($content)
	{
		//$this->photo_name = print_r($content, true);
		$this->photo_path = $content->getRealPath();
	}
}
