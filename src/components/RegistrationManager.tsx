import { useState } from 'react';
import { Event, Guest } from '../types';
import { Globe, Users, Copy, Check, UserPlus, Mail, Calendar, CreditCard, ArrowRight, Loader2, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface RegistrationManagerProps {
  event: Event;
  onUpdate: (guests: Guest[]) => void;
  isManager?: boolean;
  userEmail?: string;
}

type RegistrationStep = 'initial' | 'form' | 'payment' | 'processing' | 'success';

export function RegistrationManager({ event, onUpdate, isManager = true, userEmail }: RegistrationManagerProps) {
  const [step, setStep] = useState<RegistrationStep>('initial');
  const [formData, setFormData] = useState({ name: '', email: userEmail || '' });
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showRepeatWarning, setShowRepeatWarning] = useState(false);

  const confirmedCount = event.guests.filter(g => g.status === 'confirmed').length;
  const remainingCapacity = event.capacity - confirmedCount;
  const progress = (confirmedCount / event.capacity) * 100;

  const isRegistered = userEmail ? event.guests.some(g => g.email === userEmail && g.status === 'confirmed') : false;

  const handleRegister = () => {
    setStep('processing');
    setTimeout(() => {
      const newGuests: Guest[] = Array.from({ length: ticketQuantity }).map((_, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: i === 0 ? (formData.name || 'Customer') : `${formData.name || 'Customer'} (Guest ${i + 1})`,
        email: formData.email,
        status: 'confirmed',
        registrationDate: new Date().toISOString()
      }));
      onUpdate([...event.guests, ...newGuests]);
      setStep('success');
    }, 2000);
  };

  const [cancellingTicketId, setCancellingTicketId] = useState<string | null>(null);
  const [cancelStep, setCancelStep] = useState<'confirm' | 'method' | 'details' | 'processing' | 'success'>('confirm');
  const [refundMethod, setRefundMethod] = useState<'original' | 'bank'>('original');
  const [bankDetails, setBankDetails] = useState({ account: '', bank: '', name: '' });

  const handleCancelTicket = () => {
    if (!cancellingTicketId) return;
    setCancelStep('processing');
    setTimeout(() => {
      const updatedGuests = event.guests.filter(g => g.id !== cancellingTicketId);
      onUpdate(updatedGuests);
      setCancelStep('success');
    }, 2000);
  };

  const closeCancelModal = () => {
    setCancellingTicketId(null);
    setCancelStep('confirm');
    setBankDetails({ account: '', bank: '', name: '' });
  };

  const startRegistration = () => {
    if (isRegistered && !showRepeatWarning) {
      setShowRepeatWarning(true);
    } else {
      setStep('form');
    }
  };

  const myTickets = event.guests.filter(g => g.email === userEmail && g.status === 'confirmed');

  return (
    <div className="space-y-8">
      {/* Cancellation Modal */}
      {cancellingTicketId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 relative">
            <button 
              onClick={closeCancelModal}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <div className="p-8">
              {cancelStep === 'confirm' ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                    <Users size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Cancel Ticket?</h3>
                    <p className="text-sm text-gray-500">Are you sure you want to cancel this ticket? This action cannot be undone.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={closeCancelModal}
                      className="flex-1 py-4 bg-gray-100 text-black rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                      No, Keep it
                    </button>
                    <button 
                      onClick={() => setCancelStep('method')}
                      className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              ) : cancelStep === 'method' ? (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Refund Method</h3>
                    <p className="text-xs text-gray-400">How would you like to receive your refund of <span className="text-black font-bold">${event.price}</span>?</p>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setRefundMethod('original')}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between",
                        refundMethod === 'original' ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <div>
                        <p className="font-bold text-sm">Original Payment Method</p>
                        <p className="text-xs text-gray-500">Refund to the card used for booking</p>
                      </div>
                      {refundMethod === 'original' && <Check className="text-blue-600" size={18} />}
                    </button>
                    <button 
                      onClick={() => setRefundMethod('bank')}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between",
                        refundMethod === 'bank' ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <div>
                        <p className="font-bold text-sm">Online Bank Transfer</p>
                        <p className="text-xs text-gray-500">Send money to a different bank account</p>
                      </div>
                      {refundMethod === 'bank' && <Check className="text-blue-600" size={18} />}
                    </button>
                  </div>
                  <button 
                    onClick={() => refundMethod === 'bank' ? setCancelStep('details') : handleCancelTicket()}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all"
                  >
                    {refundMethod === 'bank' ? 'Enter Bank Details' : 'Confirm Cancellation'}
                  </button>
                </div>
              ) : cancelStep === 'details' ? (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Bank Details</h3>
                    <p className="text-xs text-gray-400">Please provide the details for the refund transfer.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase">Account Holder Name</label>
                      <input 
                        type="text"
                        placeholder="Full Name"
                        value={bankDetails.name}
                        onChange={e => setBankDetails({ ...bankDetails, name: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase">Bank Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Chase, Bank of America"
                        value={bankDetails.bank}
                        onChange={e => setBankDetails({ ...bankDetails, bank: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase">Account Number / IBAN</label>
                      <input 
                        type="text"
                        placeholder="0000 0000 0000"
                        value={bankDetails.account}
                        onChange={e => setBankDetails({ ...bankDetails, account: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCancelStep('method')}
                      className="flex-1 py-4 bg-gray-100 text-black rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleCancelTicket}
                      disabled={!bankDetails.name || !bankDetails.bank || !bankDetails.account}
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
                    >
                      Confirm & Refund
                    </button>
                  </div>
                </div>
              ) : cancelStep === 'processing' ? (
                <div className="text-center py-12 space-y-4">
                  <Loader2 className="mx-auto text-blue-600 animate-spin" size={48} />
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl">Processing Refund</h3>
                    <p className="text-sm text-gray-500">We're cancelling your ticket and initiating the refund...</p>
                  </div>
                </div>
              ) : cancelStep === 'success' ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Check size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Ticket Cancelled</h3>
                    <p className="text-sm text-gray-500">Your ticket has been successfully cancelled and a refund of <span className="font-bold text-black">${event.price}</span> has been initiated.</p>
                    <p className="text-xs text-gray-400">Refund will be processed via {refundMethod === 'original' ? 'Original Payment Method' : 'Bank Transfer'}.</p>
                  </div>
                  <button 
                    onClick={closeCancelModal}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registration Status</h4>
            <div className={cn(
              "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
              event.isPublic ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
            )}>
              {event.isPublic ? 'Public' : 'Private'}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{confirmedCount}</span>
              <span className="text-sm text-gray-400">/ {event.capacity} capacity</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  progress > 90 ? "bg-red-500" : progress > 70 ? "bg-yellow-500" : "bg-blue-500"
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {remainingCapacity > 0 
                ? `${remainingCapacity} seats remaining` 
                : 'Event is fully booked!'}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex items-center justify-center">
          {!isManager ? (
            <div className="w-full max-w-md py-4">
              {step === 'success' ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Check size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Success!</h3>
                    <p className="text-sm text-gray-500">You have successfully booked {ticketQuantity} ticket{ticketQuantity > 1 ? 's' : ''}.</p>
                    <p className="text-xs text-gray-400">Confirmation sent to {formData.email}.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setStep('initial');
                      setShowRepeatWarning(false);
                      setTicketQuantity(1);
                    }}
                    className="w-full py-3 bg-gray-100 text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Back to Event
                  </button>
                </div>
              ) : step === 'initial' ? (
                <div className="text-center space-y-6">
                  {!event.isPublic ? (
                    <div className="space-y-4 py-8">
                      <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                        <Globe size={32} className="opacity-50" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl">Private Event</h3>
                        <p className="text-sm text-gray-500">This event is private. Registration is by invitation only.</p>
                      </div>
                    </div>
                  ) : showRepeatWarning ? (
                    <div className="space-y-6 p-6 bg-yellow-50 rounded-3xl border border-yellow-100">
                      <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
                        <Users size={24} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl text-yellow-900">Book another ticket?</h3>
                        <p className="text-sm text-yellow-700">You already have a ticket for this event. Would you like to book another one for yourself or a guest?</p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setShowRepeatWarning(false)}
                          className="flex-1 py-3 bg-white text-yellow-700 border border-yellow-200 rounded-xl font-bold text-sm hover:bg-yellow-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => setStep('form')}
                          className="flex-1 py-3 bg-yellow-600 text-white rounded-xl font-bold text-sm hover:bg-yellow-700 transition-colors shadow-lg shadow-yellow-200"
                        >
                          Yes, Book Another
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-bold text-2xl">Join this event</h3>
                        <p className="text-sm text-gray-500">Register now to secure your spot. Limited seats available!</p>
                      </div>
                      <div className="flex items-center justify-center gap-8 py-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">${event.price}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Ticket Price</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="text-center">
                          <p className="text-2xl font-bold">{remainingCapacity}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Available</p>
                        </div>
                      </div>
                      <button 
                        onClick={startRegistration}
                        disabled={remainingCapacity <= 0}
                        className={cn(
                          "w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                          remainingCapacity > 0 
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100" 
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        <UserPlus size={18} />
                        {remainingCapacity > 0 ? (isRegistered ? 'Book Another Ticket' : 'Register Now') : 'Sold Out'}
                      </button>
                    </>
                  )}
                </div>
              ) : step === 'form' ? (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl">Booking Details</h3>
                    <p className="text-xs text-gray-400">Tell us how many people are coming.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase">Number of Tickets</label>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                          className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="text-xl font-bold w-8 text-center">{ticketQuantity}</span>
                        <button 
                          onClick={() => setTicketQuantity(Math.min(remainingCapacity, ticketQuantity + 1))}
                          className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                        <span className="text-xs text-gray-400 ml-auto">Max {remainingCapacity} available</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase">Primary Attendee Name</label>
                      <input 
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                      <input 
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Subtotal ({ticketQuantity} ticket{ticketQuantity > 1 ? 's' : ''})</span>
                      <span className="font-bold">${(event.price || 0) * ticketQuantity}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep('payment')}
                    disabled={!formData.name || !formData.email || ticketQuantity <= 0}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : step === 'payment' ? (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl">Secure Payment</h3>
                    <p className="text-xs text-gray-400">Total amount to pay: <span className="text-black font-bold">${(event.price || 0) * ticketQuantity}</span></p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                      <CreditCard className="text-blue-600" size={20} />
                      <div className="text-xs text-blue-800">
                        <p className="font-bold">Encrypted Transaction</p>
                        <p className="opacity-70">Your payment details are safe and secure.</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase">Card Number</label>
                      <input 
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={e => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase">Expiry</label>
                        <input 
                          type="text"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase">CVC</label>
                        <input 
                          type="text"
                          placeholder="000"
                          value={cardData.cvc}
                          onChange={e => setCardData({ ...cardData, cvc: e.target.value })}
                          className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleRegister}
                    disabled={!cardData.number || !cardData.expiry || !cardData.cvc}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-100"
                  >
                    Pay ${(event.price || 0) * ticketQuantity} & Register
                  </button>
                </div>
              ) : step === 'processing' ? (
                <div className="text-center py-12 space-y-4">
                  <Loader2 className="mx-auto text-blue-600 animate-spin" size={48} />
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl">Processing Payment</h3>
                    <p className="text-sm text-gray-500">Please wait while we confirm your registration...</p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <Users className="mx-auto text-gray-300" size={32} />
              <p className="text-sm text-gray-500 font-medium">Registration is managed externally</p>
              <p className="text-xs text-gray-400">Managers can monitor real-time sign-ups below.</p>
            </div>
          )}
        </div>
      </div>

      {!isManager && myTickets.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <h4 className="font-bold flex items-center gap-2">
              <Users size={18} /> My Booked Tickets
            </h4>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              {myTickets.length} Ticket{myTickets.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="divide-y divide-black/5">
            {myTickets.map(ticket => (
              <div key={ticket.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="space-y-1">
                  <p className="font-bold text-sm">{ticket.name}</p>
                  <p className="text-xs text-gray-400">Booked on {new Date(ticket.registrationDate!).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => setCancellingTicketId(ticket.id)}
                  className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                >
                  Cancel & Refund
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isManager && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/5">
            <h4 className="font-bold flex items-center gap-2">
              <Users size={18} /> Registered Attendees
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Registered On</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {event.guests.filter(g => g.registrationDate).sort((a, b) => new Date(b.registrationDate!).getTime() - new Date(a.registrationDate!).getTime()).map(guest => (
                  <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold">{guest.name}</td>
                    <td className="px-6 py-4 text-gray-500">{guest.email}</td>
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(guest.registrationDate!).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
                {event.guests.filter(g => g.registrationDate).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                      No registrations recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
