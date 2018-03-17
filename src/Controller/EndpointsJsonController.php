<?php
/**
 * @file
 * Contains \Drupal\endpoints\Controller\CuesJsonController.
 */

namespace Drupal\endpoints\Controller;

use Drupal\user\Entity\User;
use Drupal\Core\Controller\ControllerBase;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class EndpointsJsonController extends ControllerBase {

	public function getUser( Request $request ) {

		$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
		// retrieve field data from that user
		$uid= $user->get('uid')->value;
		$name = $user->get('name')->value;
		$email = $user->get('mail')->value;

		$response['uid'] = $uid;
		$response['name'] = $name;
		$response['email'] = $email;

		return new JsonResponse( $response );
	}

	public function put( Request $request ) {

		$response['data'] = 'Some test data to return';
		$response['method'] = 'PUT';

		return new JsonResponse( $response );
	}

	public function post( Request $request ) {

		if ( 0 === strpos( $request->headers->get( 'Content-Type' ), 'application/json' ) ) {
		$data = json_decode( $request->getContent(), TRUE );
		$request->request->replace( is_array( $data ) ? $data : [] );
		}

		$response['data'] = 'Some test data to return';
		$response['method'] = 'POST';

		return new JsonResponse( $response );
	}

	public function delete( Request $request ) {

		$response['data'] = 'Some test data to return';
		$response['method'] = 'DELETE';

		return new JsonResponse( $response );
	}

}