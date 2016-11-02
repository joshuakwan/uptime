/**
 * Module dependencies.
 */

var util = require('util');
var dns  = require('dns');
var net  = require('net');
var ping = require('ping');
var BasePoller = require ('../basePoller');

/**
 * ICMP Poller constructor
 *
 * @param {Mixed} Poller Target (e.g. URL)
 * @param {Number} Poller timeout in milliseconds. Without response before this duration, the poller stops and executes the error callback.
 * @param {Function} Error/success callback
 * @api   public
 */
function IcmpPoller(target, timeout, callback) {
  // this.target   = target;
  // this.timeout  = timeout || 5000;
  // this.callback = callback;
  // this.isDebugEnabled = false;
  IcmpPoller.super_.call(this, target, timeout, callback);
  this.initialize();
}

util.inherits(IcmpPoller, BasePoller);

IcmpPoller.type = 'icmp';

IcmpPoller.validateTarget = function(target) {
  //var reg = new RegExp('icmp:\/\/(.*)');
  //return reg.test(target);
  return true;
};

/**
 * Initializer method
 *
 * @api   public
 */
IcmpPoller.prototype.initialize = function() {
  //var reg = new RegExp('icmp:\/\/(.*)');
  //console.log('ping target: ' + this.target);
  //if(!reg.test(this.target)) {
  //  console.log(this.target + ' does not seem to be a valid ICMP URL');
  //}

  //this.target = reg.exec(this.target)[1];

  // this.session = ping.createSession({
  //   networkProtocol: ping.NetworkProtocol.IPV4,
  //   timeout: this.timeout
  // });
};

/**
 * Launch the actual polling
 *
 * @api   public
 */
IcmpPoller.prototype.poll = function() {
  IcmpPoller.super_.prototype.poll.call(this);

  ping.sys.probe(this.target, (this.onResponseCallback.bind(this)));

  // if(net.isIP(this.target) == 0) {
  //   var icmp = this;
  //
  //   dns.lookup(this.target, function(error, address, family) {
  //     if (error) {
  //       icmp.onErrorCallback(error);
  //     } else {
  //       icmp.session.pingHost(address, icmp.onResponseCallback.bind(icmp));
  //     }
  //   });
  // } else {
  //   this.session.pingHost(this.target, this.onResponseCallback.bind(this));
  // }
};

/**
 * Response callback
 * @api   private
 */
IcmpPoller.prototype.onResponseCallback = function(isAlive) {
  this.timer.stop();

  if(!isAlive) {
    this.onErrorCallback(this.target + " is dead");
  } else {
    this.callback(null, this.getTime());
  }
};

/**
 * Error callback
 * @api   private
 */
IcmpPoller.prototype.onErrorCallback = function(err_msg) {
  this.timer.stop();
  this.debug(this.getTime() + "ms - Got error: " + err_msg);
  this.callback(err_msg, this.getTime());
};

module.exports = IcmpPoller;
