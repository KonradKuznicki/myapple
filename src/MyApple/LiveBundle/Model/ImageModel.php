<?php
namespace MyApple\LiveBundle\Model;

class ImageModel
{

	private static $image_size = array(
		"x" => 320, "y" => 240
	);

	private static $image_quality = 80;
	
	private static $images_path = "../../../../web/photos";

	public function __construct ($file, $nr)
	{
		$this->load($file);
		$this->resize_with_ballance();
		
		imagejpeg( $this->image, __DIR__."/".self::$images_path."/".$nr.".jpg", self::$image_quality );
		
	}

	private $image;

	private $image_type;

	public function resize_with_ballance ()
	{
		$toobigx = self::$image_size["x"] / $this->getWidth();
		$toobigy = self::$image_size["y"] / $this->getHeight();
		if ($toobigx < $toobigy)
		{
			$this->resizeToWidth(self::$image_size["x"]);
		}
		else
		{
			$this->resizeToHeight(self::$image_size["y"]);
		}
		$toobigx = self::$image_size["x"] / $this->getWidth();
		$toobigy = self::$image_size["y"] / $this->getHeight();
		if ($toobigx < $toobigy)
		{
			$this->resizeToWidth(self::$image_size["x"]);
		}
		else
		{
			$this->resizeToHeight(self::$image_size["y"]);
		}
	}

	function load ($filename)
	{
		$image_info = getimagesize($filename);
		$this->image_type = $image_info[2];
		if ($this->image_type == IMAGETYPE_JPEG)
		{
			$this->image = imagecreatefromjpeg($filename);
		}
		elseif ($this->image_type == IMAGETYPE_GIF)
		{
			$this->image = imagecreatefromgif($filename);
		}
		elseif ($this->image_type == IMAGETYPE_PNG)
		{
			$this->image = imagecreatefrompng($filename);
		}
	}

	function save ($filename, $image_type = IMAGETYPE_JPEG, $compression = 75, $permissions = null)
	{
		if ($image_type == IMAGETYPE_JPEG)
		{
			imagejpeg($this->image, $filename, $compression);
		}
		elseif ($image_type == IMAGETYPE_GIF)
		{
			imagegif($this->image, $filename);
		}
		elseif ($image_type == IMAGETYPE_PNG)
		{
			imagepng($this->image, $filename);
		}
		if ($permissions != null)
		{
			chmod($filename, $permissions);
		}
	}

	function output ($image_type = IMAGETYPE_JPEG)
	{
		if ($image_type == IMAGETYPE_JPEG)
		{
			imagejpeg($this->image);
		}
		elseif ($image_type == IMAGETYPE_GIF)
		{
			imagegif($this->image);
		}
		elseif ($image_type == IMAGETYPE_PNG)
		{
			imagepng($this->image);
		}
	}

	function getWidth ()
	{
		return imagesx($this->image);
	}

	function getHeight ()
	{
		return imagesy($this->image);
	}

	function resizeToHeight ($height)
	{
		$ratio = $height / $this->getHeight();
		$width = $this->getWidth() * $ratio;
		$this->resize($width, $height);
	}

	function resizeToWidth ($width)
	{
		$ratio = $width / $this->getWidth();
		$height = $this->getheight() * $ratio;
		$this->resize($width, $height);
	}

	function scale ($scale)
	{
		$width = $this->getWidth() * $scale / 100;
		$height = $this->getheight() * $scale / 100;
		$this->resize($width, $height);
	}

	function resize ($width, $height)
	{
		$new_image = imagecreatetruecolor($width, $height);
		imagecopyresampled($new_image, $this->image, 0, 0, 0, 0, $width, 
		$height, $this->getWidth(), $this->getHeight());
		$this->image = $new_image;
	}
}
