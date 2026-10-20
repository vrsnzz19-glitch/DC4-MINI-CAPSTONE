<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

foreach (App\Models\User::take(5)->get() as $u) {
    echo $u->email.' | role='.(isset($u->role) ? $u->role : 'n/a').PHP_EOL;
}
echo 'total users: '.App\Models\User::count().PHP_EOL;
