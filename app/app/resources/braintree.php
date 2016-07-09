<?php

Braintree_Configuration::environment($_ENV['BRAINTREE']['MODE']);
Braintree_Configuration::merchantId($_ENV['BRAINTREE']['MERCHANT_ID']);
Braintree_Configuration::publicKey($_ENV['BRAINTREE']['PUBLIC_KEY']);
Braintree_Configuration::privateKey($_ENV['BRAINTREE']['PRIVATE_KEY']);