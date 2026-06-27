from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


#Load Tokenizer:
tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")
#load model:
model = AutoModelForSeq2SeqLM.from_pretrained(
    "facebook/nllb-200-distilled-600M"
)
def translate_text(text):
    tokenizer.src_lang = "eng_Latn"
    inputs = tokenizer(
        text,
        return_tensors="pt"
    )
    translated_tokens = model.generate(**inputs,forced_bos_token_id=tokenizer.convert_tokens_to_ids("hin_Deva"))

    translated_text = tokenizer.batch_decode(translated_tokens,skip_special_tokens = True)[0]
    # return translated_tokens
    return translated_text # Return the string, not the tokens
    