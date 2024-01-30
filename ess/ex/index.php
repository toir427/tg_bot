<?php


$questions = [];
$strReplace = ['____ a. ', '____ b. ', '____ a.', '____ b.', 'a. ', 'b. ', 'c. ', 'd. '];

foreach (range(1, 6) as $b) {

    try {
        $fileContent = file_get_contents("essential$b.json");
        $json = json_decode($fileContent, true, 512, JSON_THROW_ON_ERROR);

        foreach ($json['flashcard'] as $unit) {
            foreach ($unit['exercise'] as $ex) {
                if ($ex['en'] === 'Answer Key') continue;

                libxml_use_internal_errors(true);

                $dom = new DOMDocument();
                $dom->loadHTML($ex['story']);

                $errors = libxml_get_errors();
                libxml_use_internal_errors(false);
                //print_r($errors);

                $ols = $dom->getElementsByTagName('ol');
                $div = $dom->getElementsByTagName('div');

                if ($ols->length) {
                    if (strpos($ex['story'], 'Match the phrases') || strpos($ex['story'], 'Match the clauses')) {
                        $parent = false;
                        $options = [];
                        foreach ($ols as $k => $ol) {
                            if (!$parent && str_contains($ol->getAttribute('class'), 'ul-free-option-reformat')) {
                                $parent = true;
                                foreach ($ol->childNodes as $childNode) {
                                    $options[] = str_replace(['a. ', 'b. ', 'c. ', 'd. ', 'e. ', 'f. ', 'g. ', 'h. ', 'i. ', 'j. '], '', $childNode->textContent);
                                }
                            } else if ($k / 2 != 0 && $parent) {
                                foreach ($ol->childNodes as $childNode) {
                                    $questions[] = [
                                        'type' => 'match',
                                        'question' => $childNode->textContent,
                                        'correct' => str_replace(['a. ', 'b. ', 'c. ', 'd. ', 'e. ', 'f. ', 'g. ', 'h. ', 'i. ', 'j. '], '', $childNode->getAttribute('value')),
                                        'options' => $options
                                    ];
                                }

                                $parent = false;
                                $options = [];
                            }
                        }
                    } else if (strpos($ex['story'], 'Fill in the blanks')) {
                        $ul = $dom->getElementById('ul-free-option');
                        $ol = $dom->getElementsByTagName('ol');
                        $divs = $dom->getElementsByTagName('div');
                        if ($divs->length>1){
                            continue;
                            foreach ($ol[0]->childNodes as $node) {
                                $options[] = $node->textContent;
                            }
                            foreach ($divs as $div){
                                if ($div->getAttribute('class')==='word-blank-cover') {
                                    foreach ($div->childNodes as $node){
                                        //print_r($node);die;
                                        $questions[] = [
                                            'type' => 'fill_in',
                                            'question' => $node->textCotnent,
                                            'value' => $node->getAttribute('value'),
                                            'options' => $options
                                        ];
                                    }
                                }
                            }
                        } else {
                            $options = [];
                            foreach ($ul->childNodes as $node) {
                                $options[] = $node->textContent;
                            }
                            foreach ($ol[0]->childNodes as $node){
                                $questions[] = [
                                    'type' => 'fill_in',
                                    'question' => $node->textCotnent,
                                    'value' => $node->getAttribute('value'),
                                    'options' => $options
                                ];
                            }
                        }
                    } else {
                        foreach ($ols as $i => $ol) {
                            foreach ($ol->childNodes as $li) {
                                $options = [];
                                $question = [];
                                switch ($li->getAttribute('class')) {
                                    case 'answer-the-questions-section-word-blank':
                                        if ($ol->previousElementSibling != null) {
                                            $lists = $ol->previousElementSibling->getElementsByTagName('ul');
                                            foreach ($lists as $list) {
                                                foreach ($list->childNodes as $node) {
                                                    $options[] = $dom->save($node);
                                                }
                                            }
                                            $question['type'] = 'fill_in';
                                            $question['question'] = $dom->save($li);
                                            $question['correct'] = $li->getAttribute('value');
                                            $question['options'] = $options;
                                        }
                                        break;
                                    case 'answer-the-questions-section-better-fit':
                                        $q = $li->firstChild->textContent;
                                        $question['type'] = 'better_fit';
                                        $question['question'] = str_replace($q, '', $li->textContent);
                                        $question['options'] = explode(' / ', $q);
                                        $question['correct'] = explode(' / ', $li->getAttribute($li->getAttribute('answer-index') != "" ? 'answer-index' : 'value'));
                                        break;
                                    case 'answer-the-questions-section-char':
                                        $question['type'] = 'letter';
                                        $question['question'] = $li->firstChild->textContent;
                                        $question['underlined'] = $li->firstElementChild != null ? $li->firstElementChild->textContent : '';
                                        $question['correct'] = $li->getAttribute('value');
                                        $question['pre'] = $li->getAttribute('pre');
                                        $question['post'] = str_replace($li->getAttribute('pre'), '', $li->getAttribute('value'));
                                        break;
                                    case 'answer-the-questions-word-similar':
                                        $question['type'] = 'similar';
                                        $question['question'] = $li->firstChild->textContent;
                                        $question['correct'] = $li->getAttribute('value');
                                        break;
                                    default:
                                        if ($li->firstChild != null && $li->firstChild->nodeName === 'ul') {
                                            $question['type'] = 'better';
                                            $question['correct'] = $li->getAttribute('answer-index');
                                            $options = [];
                                            foreach ($li->firstElementChild->childNodes as $value) {
                                                $options[] = str_replace($strReplace, '', $value->textContent);
                                            }
                                            $question['options'] = $options;
                                        } else {
                                            if ($li->childNodes->length) {
                                                if (str_contains($li->getAttribute('class'), 'answer-the-questions-CI')) {
                                                    $question['type'] = 'yes_no';
                                                    $question['question'] = $li->firstChild->textContent;
                                                    $question['correct'] = $li->getAttribute('value') === 'C';
                                                } else {
                                                    $question['type'] = 'single_choice';
                                                    $question['question'] = $li->firstChild->textContent;
                                                    $question['correct'] = $li->getAttribute('answer-index');
                                                    foreach ($li->childNodes as $t) {
                                                        if ($t->nodeName === 'ul') {
                                                            $options = [];
                                                            foreach ($t->childNodes as $li2) {
                                                                $options[] = str_replace($strReplace, '', $li2->textContent);
                                                            }
                                                            $question['options'] = $options;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                }
                                $questions[] = $question;
                            }
                        }
                    }
                }
            }
        }

    } catch (JsonException $e) {

    }
}

print_r(count($questions));
file_put_contents('essential_words.json', json_encode($questions, JSON_THROW_ON_ERROR));
