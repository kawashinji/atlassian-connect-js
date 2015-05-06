var AP = window.AP = {};
//INSERT AMD STUBBER HERE!
import amd from './amd';
import util from './util';
import $ from './dollar';
import _events from '../common/events';
import base64 from  '../common/base64';
import uri from '../common/uri';
import uiParams from '../common/ui-params';
import jwt from '../common/jwt';
import xdmRpc from '../common/xdm-rpc';
import rpc from './rpc';
import events from './events';
import env from './env';
import request from './request';
import dialog from './dialog';
import inlineDialog from './inline-dialog';
import messages from './messages';
import cookie from './cookie';
import history from './history';
import resize_listener from './resize_listener';

$.extend(AP, env, amd, {
    rpc: {extend: rpc.extend, init: rpc.init},
    Meta: {get: env.meta},
    request: request,
    Dialog: dialog,
});

export default AP