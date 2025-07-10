"use client";

import { Github, Heart, Star, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PolicyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function PolicyDialog({ isOpen, onClose, title, children }: PolicyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">{title}</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-8">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            {/* Logo and Description */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <Link 
                href="/" 
                className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
              >
                <div className="relative h-8 w-8">
                  <img
                    src="/logo.svg"
                    alt="logo"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  awesome-devops-cloud-ui
                </span>
              </Link>
              <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
                A curated collection of DevOps & Cloud tools, beautifully organized and easily accessible.
              </p>
            </div>

            {/* Quick Links and Stats */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/NotHarshhaa/awesome-devops-cloud-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  <span>Star on GitHub</span>
                </a>
                <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>1.2k</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between border-t pt-6 text-sm text-muted-foreground">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <span>
                © {new Date().getFullYear()} awesome-devops-cloud-ui
              </span>
              <span className="hidden md:inline-block">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="h-3 w-3 text-red-500" /> by{" "}
                <a
                  href="https://notharshhaa.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline-offset-4 hover:underline"
                >
                  H A R S H H A A
                </a>
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-4">
              <button 
                onClick={() => setShowPrivacy(true)}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
              >
                Privacy
              </button>
              <button 
                onClick={() => setShowTerms(true)}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
              >
                Terms
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Dialog */}
      <PolicyDialog
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
      >
        <div className="space-y-4">
          <p>
            At awesome-devops-cloud-ui, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
          </p>
          
          <h3 className="text-lg font-semibold">Information We Collect</h3>
          <p>
            We collect minimal information necessary to provide you with the best experience:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usage data to improve our service</li>
            <li>GitHub stars and interaction data</li>
            <li>Feedback you choose to provide</li>
          </ul>

          <h3 className="text-lg font-semibold">How We Use Your Information</h3>
          <p>
            We use the collected information to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Improve our platform and user experience</li>
            <li>Analyze usage patterns and trends</li>
            <li>Communicate important updates</li>
          </ul>

          <h3 className="text-lg font-semibold">Data Protection</h3>
          <p>
            We implement security measures to protect your information and ensure it's not accessed without authorization.
          </p>

          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p>
            If you have any questions about our Privacy Policy, please contact us.
          </p>
        </div>
      </PolicyDialog>

      {/* Terms of Service Dialog */}
      <PolicyDialog
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
      >
        <div className="space-y-4">
          <p>
            By using awesome-devops-cloud-ui, you agree to these terms of service.
          </p>

          <h3 className="text-lg font-semibold">Usage Terms</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the platform responsibly and legally</li>
            <li>Do not attempt to misuse or exploit the service</li>
            <li>Respect intellectual property rights</li>
          </ul>

          <h3 className="text-lg font-semibold">Content</h3>
          <p>
            The content on awesome-devops-cloud-ui is provided for informational purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We strive for accuracy but don't guarantee it</li>
            <li>Content may be updated or modified</li>
            <li>User-contributed content remains their property</li>
          </ul>

          <h3 className="text-lg font-semibold">Limitations</h3>
          <p>
            We reserve the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modify or discontinue services</li>
            <li>Update these terms</li>
            <li>Remove content that violates these terms</li>
          </ul>

          <h3 className="text-lg font-semibold">Disclaimer</h3>
          <p>
            The service is provided "as is" without warranties of any kind.
          </p>
        </div>
      </PolicyDialog>
    </footer>
  );
}
