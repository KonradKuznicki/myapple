<?php
namespace MyApple\LiveBundle\Form;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class EntryType extends AbstractType
{

	public function buildForm (FormBuilder $builder, array $options)
	{
		$builder->add(
			'photo',
			'hidden', 
			array(
				"required" => false
			)
		)->add(
			'content',
			'textarea', 
			array(
				'label' => " ",
				"required" => true, 
				"attr" => array(
					"class" => "anime"
				)
			)

		)->getForm();
	}

	public function getName()
	{
		return "entry";
	}
}
