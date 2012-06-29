<?php


namespace MyApple\LiveBundle\Extension;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Provides integration of the Routing component with Twig.
 *
 * @author Konrad Kuźnicki <konrad@kuznicki.me>
 */
class TwigExtension extends \Twig_Extension
{
    private $generator;

    public function __construct(UrlGeneratorInterface $generator)
    {
        $this->generator = $generator;
    }

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return array An array of functions
     */
    public function getFunctions()
    {
        return array(
            'current' => new \Twig_Function_Method($this, 'getCurrent'),
            'distinct' => new \Twig_Function_Method($this, 'makeDistinction'),
            'showTest' => new \Twig_Function_Method($this, 'test'),
        );
    }

    public function paramDump (array $params)
    {
    	$buff = "";
    	foreach ($params as $key => $val) {
    		$buff .= " $key=\"$val\" ";
    	}
    	
    	return $buff;
    }
    
    public function test($name)
    {
    	return $this->generator->generate($name, array(), false) . " : " . $_SERVER["REQUEST_URI"] . " => " . $this->getCurrent($name); 
    }
    
    /**
     * Recognizes if it is current link (on which it is rendered) or any other 
     * 
     * @param string $name
     */
    public function getCurrent($name) 
    {
    	return ($this->generator->generate($name, array(), false) == $_SERVER["REQUEST_URI"]);
    }
    
    /**
     * Applayes passed argumens to the element whether it is the same link which it is pointed to or not
     * 
     * in example <a href="{{ path('home') }}" {{ distinct("home", array("class"=>"current")) }} >
     * 
     * applies css class current to the tag if visitor is curently on path('home')
     * 
     * @param string $name
     * @param array|string $parameters
     */
    public function makeDistinction($name, $parameters) 
    {
		if($this->getCurrent($name))
		{
			if(is_array($parameters))
			{
				if(isset($parameters["current"])){
					return $this->paramDump($parameters["current"]);
				}
				else
				{
					return $this->paramDump($parameters);
				}
			}
			else
			{
				return $parameters;
			}
		}
		elseif(isset($parameters["other"]))
		{
			return $this->paramDump($parameters["other"]);
		}
    }
    
    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'tools';
    }
}
