# ToneVault Project Proposal

## Project title

**ToneVault: Guitar Effects PedalBoard Rig Setup**

## Client and context

The proposed client is a local guitar player or music group that uses guitar
effects pedals in rehearsals and performances. Members need a shared, dependable
way to keep track of their pedals and repeat useful sound setups.

## Problem statement

Guitarists often rely on memory, handwritten notes, or informal messages to
remember pedal order, individual pedal settings, signal chains, and complete rig
configurations. This makes it difficult to reproduce a sound, share a setup
with bandmates, or keep pedal information organized as equipment changes.

## Proposed solution

ToneVault will be a decoupled web application with a React single-page frontend
and a Laravel REST API backed by MySQL. Users will be able to browse a catalog
of effects pedals, assemble ordered pedalboards, save reusable rig presets, and
submit rigs for review. Administrators will maintain the catalog and manage
submitted rig status.

## Goals

1. Keep pedal and category information in one searchable catalog.
2. Let guitarists organize pedals in the order they use them.
3. Save and maintain pedalboard and rig configurations for later reuse.
4. Provide a simple approval workflow for submitted rigs.
5. Protect personal and administrative actions with authentication,
   authorization, and validation.

## Intended users

- **Admin:** maintains the pedal catalog and categories, views registered
  users, and reviews and updates rig submissions.
- **Guitarist/User:** registers, browses pedals, creates personal pedalboards
  and rigs, and tracks rig review status.

## Main data concepts

- **User:** an authenticated admin or guitarist.
- **Pedal category:** a grouping such as distortion, modulation, or delay.
- **Pedal:** a catalog item, optionally assigned to a category.
- **Pedalboard:** a user's ordered collection of pedals.
- **Pedalboard pedal:** the association between a pedalboard and a pedal,
  including its order and board-specific settings.
- **Rig preset:** a named, reusable configuration that can be submitted for
  approval and assigned a workflow status.

## Scope

The initial project scope covers Sanctum token authentication, role-based
access, pedal and pedalboard management, rig preset management and approval,
pedal search/filtering, paginated API results, dashboard summary figures,
validation, user feedback, and a responsive interface.

The application is planned for a local music group. Features such as payments,
public social networking, marketplace listings, and integrations with physical
pedal hardware are outside the initial scope.

## Success criteria

- A guitarist can register, sign in, find pedals, and maintain their own
  ordered pedalboards and rig presets.
- An administrator can manage pedal data and review submitted rigs.
- Unauthorized users cannot access protected or admin-only operations.
- API input is validated, lists support pagination, and the UI communicates
  loading, success, failure, and destructive-action confirmation states.

## Implementation note

Day 1 is planning only. The existing repository has backend and frontend
scaffolds; no feature implementation or dependency changes are included in
this proposal work. The current Laravel 13/PHP 8.3 and React 19 manifest
versions should be checked against the requested Laravel 11/12 and React 18+
baseline before Day 2 implementation.
