<?php 

error_reporting(E_ALL);

$xslt = new \XSLTProcessor();
   $xslt->importStylesheet(new  SimpleXMLElement(file_get_contents("entry.xsl")));
   echo $xslt->transformToXml(new SimpleXMLElement(file_get_contents("typical.xml"))); 


