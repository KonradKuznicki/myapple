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
class EntryModel 
{
	
	private static $folder_static = "../../../../web";
	
	private static $folder_entries = "entries";
	
	private static $file_entries_counter = "counter";
	
	
	private static $names = array (
		"mod1" => "Jan Kowalski",
		"mod2" => "John Doe",
		"mod3" => "John Smith"
	);
	
	private $id;
	private $user;
	private $photo;
	
	/**
	 * 
	 * @Assert\NotBlank()
	 * @Assert\MinLength(1)
	 */
	private $content;
	private $timestamp;
	
	public function __construct($username)
	{
		$this->user["login"] = $username;
		$this->user["identity"] = self::$names[$username];
		$this->timestamp = time();
	}
	
	
	private function increment_counter()
	{
		
		// katalog z naszymi static'ami
		$folder_static = __DIR__ . "/" .  self::$folder_static;
		
		// plik z licznikiem wpisów
		$entries_counter = $folder_static . "/" .  self::$file_entries_counter;
		
		// pobranie aktualnego numeru wpisu
		$current_id = file_get_contents($entries_counter);
		
		// inkrementacja licznika
		$this->id = $current_id+1;
		
		// zapis nowego stanu
		$current_id = file_put_contents($entries_counter, $this->id);
		
	}
	
	private function dump_object ()
	{
		// rozwiązywanie nazwy katalogu z wpisami
		$file_name = __DIR__ . "/" .  self::$folder_static . "/" .  self::$folder_entries . "/" . $this->id;
		
		// serializacja obiektu 
		$params = get_object_vars($this);
		
		// tworzenie jsona
		$params = json_encode($params);
		
		// zapis
		file_put_contents($file_name, $params);
		
		// utworzenie wersji gzipowanej jesli cokolwiek na tym zyskamy (dla mniej niż 200 znaków możemy mieć większy rozmiar po kompresji :) )
		if(strlen($params) > 200)
		{
			// kopresja
			$params = gzencode($params, 9);
			
			// zapis
			file_put_contents($file_name.".gz", $params);
		}
	}
	

	public function save()
	{
		// jeśli dane nie są wypełnione to nie ma sensu nic zapisywać
		
			// inkrementacja licznika
			$this->increment_counter();
			
			// zapis na dysk i opcjonalna kompresja
			$this->dump_object();
		
	}
	
	public function getId()
	{
		return $this->id;
	}
	
	public function getContent()
	{
		return $this->content;
	}
	
	public function getPhoto()
	{
		return $this->photo;
	}
	
	public function getTimestamp()
	{
		return $this->content;
	}
	
	public function getUser() 
	{
		return $this->user;
	}

	public function setContent($content)
	{
		$this->content = $content;//.$counter;
	}
	
	public function setPhoto($content)
	{
		$this->photo = $content;
	}
}
