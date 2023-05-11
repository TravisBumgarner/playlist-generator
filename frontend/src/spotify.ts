import axios from 'axios'
import { Literal, Record, Union, String, Number } from 'runtypes'
import { ELocalStorageItems, getLocalStorage } from 'utilities'

const Token = Record({
    access_token: String,
    token_type: Union(Literal('Bearer')),
    expires_in: Number
})
