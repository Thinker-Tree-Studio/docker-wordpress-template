<?php
	
/**
 * [BLOCK NAME] Block Template
 *
 */	

/* Create id attribute allowing for custom "anchor" value */
$id = '[BLOCK-NAME-]' . $block[ 'id' ];

if( !empty( $block[ 'anchor' ] ) ) {
	$id = $block[ 'anchor' ];
}

/* Create class attribute allowing for custom "className" and "align" */
$className = '[BLOCK-NAME]';
if( !empty( $block[ 'className' ] ) ) {
	$className .= ' ' . $block[ 'className' ];
}
if( !empty( $block['align'] ) ) {
	$className .= ' align' . $block['align'];
}

?>