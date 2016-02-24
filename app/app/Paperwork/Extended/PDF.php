<?php

namespace NOT_USED_DO_NOT_USE_THIS\Extended;

use Symfony\Component\Process\Process;
use Symfony\Component\HttpFoundation\Response;

class PDF {
	
	protected $jobID;
	protected $name;
	protected $html;
	protected $pdf;
	
	public function load($html, $jobID, $name){
		$this->jobID = $jobID;
		$this->name = $name;
		$this->html = $this->captureImage($html);
	}
	
	protected function captureImage($view){
		$path = $this->writeFile($view);
		return $path;
	}
	
	public function writeFile($view){
		$app = \Slim\Slim::getInstance();
		if($app->config('pdf') == 'windows'){
			file_put_contents($path = "../app/app/storage/temp/{$this->name}{$this->jobID}.html", $view);
			$out = "../app/app/storage/temp/{$this->name}{$this->jobID}.pdf";
			exec('"D:\CADE\Drive\xampp\htdocs\wolfe.nz\app\app\bin\CutyCapt.exe" --print-backgrounds=on --url="'.$path.'" --out="'.$out.'"', $a, $b);
		}else if($app->config('pdf') == 'linux'){
			file_put_contents($path = "../app/app/storage/temp/{$this->name}{$this->jobID}.html", $view);
			$out = "../app/app/storage/temp/{$this->name}{$this->jobID}.pdf";
			exec('xvfb-run --server-args="-screen 0, 595x842x24" cutycapt --print-backgrounds=on --url="'.$app->root.'/app/app/storage/temp/'.$this->name.$this->jobID.'.html" --out="'.$out.'"', $a, $b);
		}
		$this->pdf = $out;
		return $path;
	}
	
	public function respond($file, $fname){
		$response = new Response(file_get_contents($file), 200, [
			'Content-Description' => 'File Transfer',
			'Content-Disposition'	=> 'attachment; filename="'.$fname.'"',
			'Content-Transfer-Encoding'	=> 'binary',
			'Content-Type'	=> 'application/pdf'
		]);
		unlink($file);
		$response->send();
	}
}