<?php

namespace MyApple\LiveBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\Security\Core\SecurityContext;
use MyApple\LiveBundle\Form;
use MyApple\LiveBundle\Model;

/**
 *
 * @Route("/Admin")
 */
class DefaultController extends Controller
{
    /**
     * @Route("/", name="home")
     * @Template()
     */
    public function indexAction()
    {
    	
    	$photo = new Model\PhotoModel(
    		$this->get('security.context')->getToken()->getUsername()
    	);

    	$photo = $this->createForm(new Form\PhotoType(), $photo);
    

	
    	$entry = new Model\EntryModel(
    		$this->get('security.context')->getToken()->getUsername()
    	);
    	
    	$entry_form = $this->createForm(new Form\EntryType(), $entry);
    	
		return array('User' => $entry->getUser(), 'entry' => $entry_form->createView(), 'photo' => $photo->createView());
    }
    
    
    /**
     * @Route("/login", name="login")
     * @Template()
     */
    public function loginAction()
    {
        // get the login error if there is one
        if ($this->get('request')->attributes->has(SecurityContext::AUTHENTICATION_ERROR)) {
            $error = $this->get('request')->attributes->get(SecurityContext::AUTHENTICATION_ERROR);
        } else {
            $error = $this->get('request')->getSession()->get(SecurityContext::AUTHENTICATION_ERROR);
        }

        return array(
            // last username entered by the user
            'last_username' => $this->get('request')->getSession()->get(SecurityContext::LAST_USERNAME),
            'error'         => $error,
        );
    }
    
   
   
	/**
	 * @Route("/login_check", name="login_check")
	 * @Template()
	 */
	public function login_checkAction()
	{
		return array();
	} 

	/**
	 * @Route("/logout", name="logout")
	 * @Template()
	 */
	public function logoutAction()
	{
		return array();
	} 

    /**
     * @Route("/stats", name="stats")
     * @Template()
     */
    public function statsAction () 
    {
    	return array();
    }
    
    
}
