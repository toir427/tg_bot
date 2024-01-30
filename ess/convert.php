<?php

$from = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я', 'ў', 'ғ', 'қ', 'ҳ', 'е'];
$to = ['a', 'b', 'v', 'g', 'd', 'e', 'yo', 'j', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'x', 's', 'ch', 'sh', 'sh', '`', 'i', '`', 'e', 'yu', 'ya', 'o‘', 'g‘', 'q', 'h', 'ye'];

$fileContent = file_get_contents("words.json");

try {
    $books = json_decode($fileContent, true, 512, JSON_THROW_ON_ERROR);

    $result = [];
    foreach ($books as $b => $book) {
        foreach ($book as $word => $translation) {
            $result[$b][$word] = str_replace($from, $to, $translation);
        }
    }
    file_put_contents('words2.json', json_encode($result, JSON_THROW_ON_ERROR));

} catch (JsonException $e) {
    print_r($e);
}