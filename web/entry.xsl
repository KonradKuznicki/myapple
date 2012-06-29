<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="content">
	<div class="entry">
			
		<xsl:attribute name="id">entry<xsl:value-of select="id" /></xsl:attribute>
  
  		<div class="outline">
  
			<div class="time">
				<span class="clockeffect"><span>L</span></span><xsl:value-of select="time" />
			</div>
		
			<div class="content">
		
				<xsl:choose>
					<xsl:when test="photo">
						<div class="photo">
							<img>
								<xsl:attribute name="src">/photos/<xsl:value-of select="photo" />.jpg</xsl:attribute>
								<xsl:attribute name="style">display: none;</xsl:attribute>
								<xsl:attribute name="onload">scroll = engine.scroll.compute(nr);if(scroll) curpos = engine.scroll.position(); this.style.display = "block"; if(scroll) engine.scroll.position(curpos);</xsl:attribute>
							</img>
						
							<div class="photo_desc">
								Zdjęcie nr <xsl:value-of select="id" />: <xsl:value-of select="content" />
							</div>
						</div>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="content" />
					</xsl:otherwise>
				</xsl:choose>
			
			</div>
		
		</div>
		
		<div class="sign">
		
			 <xsl:value-of select="user/identity" />
			 |
			 <span>Wypowiedź nr <xsl:value-of select="id" /></span>
		
		</div>
		
		<div class="topeffect"></div>
		
		<div class="bottomeffect1"></div>
		<div class="bottomeffect2"></div>
		<div class="bottomeffect3"></div>
		
		
	</div>
</xsl:template>

</xsl:stylesheet>
