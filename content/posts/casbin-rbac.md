+++
title = "Implementing Authorization using Casbin. Introduction to Casbin RBAC"
description = "Intro to Casbin RBAC and authorization rules, policies"
date = 2023-06-21T00:00:00Z
updated = 2023-06-21T00:00:00Z
draft = false
+++

Casbin is a library used to implement authorization of different kinds. It simplifies the implementation of roles and permissions in general and it does provide out of box useful methods. Casbin uses some entities inorder to define roles and permissions.

As you can see, there are different types of authorization models we can use depending on the usecase.

Model is where we define few parameters on which casbin decides whether to allow or deny the request. There are 4 main entities.
1. **request_definition**: Used to define what a request is going to look like. 
    Example: ```r = sub, obj, act``` which means the request will contain 3 arguments: subject, object, action
    usually,
    - **subject** is the person requesting
    - **object** is what the person wants to access
    - **action** is what the person wants to do to the object (read, write, update, etc...)
2. **policy_definition**: Used to define how a policy is going to look like. This policy will be defined in a separate file. We are just declaring the arguments for the policy here.
    Example: ```p = sub, obj, act```
3. **policy_effect**: Its the condition(s) used to make a decision of allowing/denying the subject to take action on the object.
    Example: ```e = some(where (p.eft == allow))```
4. **matchers**: Used to match the policy, request to the policy definitions.
    Example: ```m = r.sub == p.sub && r.obj == p.obj && r.act == p.act```
    In the above example, we are comparing the request's subject to subject in the policy and a couple of similar comparisions.

Policy is one of the main entities of Casbin. It is where we define who has access to what and more. Above, there is an example where we do
```r.sub == p.sub```. This means that casbin checks if there is any match for the requests's subject and policy's subject. It basically
says that the subject or the person requesting should have entry in the policy definition.
Example of a policy file:
```
p, alice, data1, read
p, bob, data2, write
```
here, the first letter is to map the line to policy definition `p` which we defined in the model above. Hence, this line should have 3 arguments.
In the above example,
```
alice -> subject
data1 -> objects
read -> action
```

Use [casbin online editor](https://casbin.org/editor) to try out different types of models and policies.

#### RBAC (Role Based Access Control) with domains
To take an example, AWS. You have organizations, and users each having different permissions and roles. You can login to different organizations with the same email.

Lets define the 4 entities how we did above, but with some outcome.
#### request_definition
Here, lets say email is the primary key, so we'll use that to identify the user.
```
[request_definition]
r = sub, org, obj, act
```
We're taking 4 args this time with the request. `org` is the added arg along with previous ones. It stands for organization (we can name whatever we want, it does not matter). Since, we need to know which org this request wants to access; we take it as request arg.

#### policy_definition
```
[policy_definition]
p = sub, obj, act
```
This is same as previous example. we only take 3 policy args.

#### role_definition
```
[role_definition]
g = _, _, _
g2 = _, _, _
```
This looks weird, but we'll find this useful when we know what exactly this does. `g` and `g2` stands for grouping.
If we boil down the input and output, we just want to know if a user of some org can access a particular entity.

#### policy_effect and matchers
```
[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub, r.org) && g2(r.sub, r.org, "joined") && r.obj == p.obj && r.act == p.act
```

In the matcher, we have 4 checks.
1. `g(r.sub, p.sub, r.org)`: It checks if there is a group with request's subject, policys's subject and requests's org in the same line.
    For example: `g, alice, admin, org_1`. This check returns true iff `r.sub == alice`, `p.sub == admin`, and `r.org == org_1`
    This `g, alice, admin, domain1` will be defined in a separate policy file.
    
2. `g2(r.sub, r.org, joined)`: This is similar to the above group, just the name differs.
    For example: `g2, mano, org_1, joined`. This check returns true iff `r.sub == mano`, `r.org == org_1`, and the 3rd argument must be `joined = joined`.

3. `r.obj == p.obj`: it sees if requests's object matches policy's object.
    For example, 
    `p, admin, profile, read` is the policy def (profile is the obj here)
    `r, mano, org_1, profile, read` is the request (profile is the obj here)
    Hence, the objects match; this should return `true`.
4.  `r.act == p.act`: it similar to the above check, verifying if the actions match.

If these 4 checks pass, casbin allows or return true for the request. This is called `enforcing` and casbin uses `enforcer` to check if the request matches with the policies.

This is just a small example. We can configure our own rules in a more complex way according to our requirements.

By default, policies are stored in `policy.csv` file (since it is also separated using commas). Although Casbin provides adapters to use database instead of a file to store the model and policy.

#### Refs:
- https://casbin.org/editor
- https://casbin.org/docs/how-it-works