<?php
namespace MyApple\LiveBundle\Form;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class PhotoType extends AbstractType
{
	public function getDefaultOptions(array $options)
	{
		return array('csrf_protection' => false);
	}

	public function buildForm (FormBuilder $builder, array $options)
	{
		$builder->add(
			'photo',
			'file', 
			array(
				'label' => "Zdjęcie:",
				"required" => true
			)
		)->getForm();
	}

	public function getName()
	{
		return "photo";
	}
}
