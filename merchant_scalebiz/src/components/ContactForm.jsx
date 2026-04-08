import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import ThemedButton from '@/components/ThemedButton';
import { submitContactForm } from '@/lib/api'; // Import the API function
import { showSuccess, showError } from '@/utils/toast';

const contactFormSchema = z.object({
  full_name: z.string().min(1, { message: 'Full Name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: 'Subject is required.' }),
  order_number: z.string().optional(),
  message: z.string().min(1, { message: 'Message is required.' }),
});

const ContactForm = () => {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      subject: '',
      order_number: '',
      message: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      await submitContactForm(values);
      showSuccess('Your message has been sent successfully!');
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showError('Failed to send your message. Please try again later.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 md:p-8 bg-card shadow-lg rounded-lg border">
        <h2 className="text-2xl font-bold text-foreground mb-6">Contact Us</h2>

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Inquiry about product A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="ORDER-12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="I would like to know more about product A." rows="4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ThemedButton type="submit" className="w-full">
          Submit
        </ThemedButton>
      </form>
    </Form>
  );
};

export default ContactForm;