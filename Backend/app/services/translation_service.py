from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


#Load Tokenizer:
tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")
#load model:
model = AutoModelForSeq2SeqLM.from_pretrained(
    "facebook/nllb-200-distilled-600M"
)
def translate_text(text, src_lang="eng_Latn", tgt_lang="hin_Deva"):
    tokenizer.src_lang = src_lang
    inputs = tokenizer(
        text,
        return_tensors="pt"
    )
    
    # Dual-tokenizer compatibility fallback (NllbTokenizer vs NllbTokenizerFast)
    if hasattr(tokenizer, "lang_code_to_id"):
        forced_bos_token_id = tokenizer.lang_code_to_id[tgt_lang]
    else:
        forced_bos_token_id = tokenizer.convert_tokens_to_ids(tgt_lang)

    translated_tokens = model.generate(**inputs, forced_bos_token_id=forced_bos_token_id)

    translated_text = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]
    return translated_text
    