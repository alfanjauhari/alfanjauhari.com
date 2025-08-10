---
title: Elementor Beautiful Global Variables Name
description: This snippet provides a method to create beautiful global variable names in Elementor, enhancing readability and maintainability of your Elementor projects.
createdAt: 2024-06-13
---

**DISCLAIMER**: This snippet is cloned from my [GitHub Gist](https://gist.github.com/alfanjauhari/42708dd15eea84933df198034861b5f5) and hasn't been tested in a long time. The last time I used it was for one of my office's WordPress projects, so it may not work as expected in your environment. Please if you find any issues, feel free to comment on the [GitHub Gist](https://gist.github.com/alfanjauhari/42708dd15eea84933df198034861b5f5) (i will look into it (when i want to ofc 😂))

```php
<?php

function elementor_beautify_global_colors_and_typography( $data, \Elementor\Core\Base\Document $document_instance ) {
	if ( ! isset( $data['settings']['custom_colors'] ) ) {
		return $data;
	}

	$custom_colors = $data['settings']['custom_colors'];

	foreach ( $custom_colors as &$color ) {
		$color['_id'] = sanitize_title( $color['title'] );
	}
	unset( $color );

	$data['settings']['custom_colors'] = $custom_colors;

	if ( ! isset( $data['settings']['custom_typography'] ) ) {
		return $data;
	}

	$custom_typography = $data['settings']['custom_typography'];

	foreach ( $custom_typography as &$typography ) {
		$typography['_id'] = sanitize_title( $typography['title'] );
	}
	unset( $typography );

	$data['settings']['custom_typography'] = $custom_typography;

	return $data;
}

add_filter( 'elementor/document/save/data', 'elementor_beautify_global_colors_and_typography', 10, 2 );

function register_rest_endpoints() {
    register_rest_route(
      'elementor/v1',
      '/globals/colors/(?P<id>[\\w-]+)',
      array(
        'methods' => array( \WP_REST_Server::READABLE, \WP_REST_Server::CREATABLE, \WP_REST_Server::DELETABLE ),
        'callback' => 'get_requested_global_color',
        'permission_callback' => '__return_true',
      )
    );

    register_rest_route(
      'elementor/v1',
      '/globals/typography/(?P<id>[\\w-]+)',
      array(
        'methods' => array( \WP_REST_Server::READABLE, \WP_REST_Server::CREATABLE, \WP_REST_Server::DELETABLE ),
        'callback' => 'get_requested_global_typography',
        'permission_callback' => '__return_true',
      )
    );
}

add_action( 'rest_api_init', 'register_rest_endpoints' );

function get_requested_global_color( $request ){

	$kit = \Elementor\Plugin::$instance->kits_manager->get_active_kit_for_frontend();

	$system_items = $kit->get_settings_for_display( 'system_colors' );
	$custom_items = $kit->get_settings_for_display( 'custom_colors' );

	$items = array_merge( $system_items, $custom_items );
	$result = [];

	foreach ( $items as $index => $item ) {
		$id = $item['_id'];
		$result[ $id ] = [
			'id' => $id,
			'title' => $item['title'],
			'value' => $item['color'],
		];
	}

	if ( ! isset( $result[ $request->get_param( 'id' ) ] ) ) {
		throw new Error_404( esc_html__( 'The Global value you are trying to use is not available.', 'elementor' ),
			'global_not_found'
		);
	}

	return $result[ $request->get_param( 'id' ) ];
}

function get_requested_global_typography( $request ) {
	$kit = \Elementor\Plugin::$instance->kits_manager->get_active_kit_for_frontend();

	$system_items = $kit->get_settings_for_display( 'system_typography' );
	$custom_items = $kit->get_settings_for_display( 'custom_typography' );

	$items = array_merge( $system_items, $custom_items );
	$result = [];

	foreach ( $items as $index => $item ) {
		$id = $item['_id'];
		$result[ $id ] = [
			'id' => $id,
			'title' => $item['title'],
			'value' => $item['font_family'],
			'size' => $item['font_size'],
			'weight' => $item['font_weight'],
			'style' => $item['font_style'],
			'line_height' => $item['line_height'],
			'letter_spacing' => $item['letter_spacing'],
			'text_transform' => $item['text_transform'],
			'text_decoration' => $item['text_decoration'],
		];
	}

	if ( ! isset( $result[ $request->get_param( 'id' ) ] ) ) {
		throw new Error_404( esc_html__( 'The Global typography you are trying to use is not available.', 'elementor' ),
			'global_typography_not_found'
		);
	}

	return $result[ $request->get_param( 'id' ) ];
}
```
